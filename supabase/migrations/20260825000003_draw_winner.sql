-- Winner selection: admin-triggered, atomic draw from valid entries. Follows
-- the same "security definer Postgres function does the whole thing under a
-- row lock" pattern as purchase_entry() rather than multiple round trips
-- from the app, so a double-click / concurrent call can't double-draw.
--
-- Dropped first because `create or replace function` cannot change a
-- function's OUT-parameter row type (Postgres error 42P13) — safe to run
-- more than once since nothing else references this function by name.
drop function if exists public.draw_winner(uuid);

create or replace function public.draw_winner(p_competition_id uuid)
returns table (winner_entry_id uuid, winner_user_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status public.competition_status;
  v_existing_winner uuid;
  v_title text;
  v_winner_entry_id uuid;
  v_winner_user_id uuid;
  v_entrant record;
begin
  if not public.is_admin() then
    raise exception 'Admin only';
  end if;

  select status, winner_entry_id, title
    into v_status, v_existing_winner, v_title
  from public.competitions
  where id = p_competition_id
  for update;

  if not found then
    raise exception 'Competition not found';
  end if;

  if v_existing_winner is not null then
    raise exception 'This competition already has a winner';
  end if;

  if v_status <> 'closed' then
    raise exception 'Competition must be closed before drawing a winner';
  end if;

  select id, user_id into v_winner_entry_id, v_winner_user_id
  from public.entries
  where competition_id = p_competition_id
  order by random()
  limit 1;

  if v_winner_entry_id is null then
    raise exception 'No entries to draw from';
  end if;

  update public.competitions
  set winner_entry_id = v_winner_entry_id,
      drawn_at = now(),
      status = 'drawn'
  where id = p_competition_id;

  perform public.notify(v_winner_user_id, p_competition_id, 'you_won', v_title);

  for v_entrant in
    select distinct user_id from public.entries
    where competition_id = p_competition_id and user_id <> v_winner_user_id
  loop
    perform public.notify(v_entrant.user_id, p_competition_id, 'competition_drawn', v_title);
  end loop;

  return query select v_winner_entry_id, v_winner_user_id;
end;
$$;
