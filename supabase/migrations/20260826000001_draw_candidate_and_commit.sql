-- Replaces the single-shot draw_winner() (20260825000003_draw_winner.sql)
-- with a two-step flow: pick_random_entrant() re-rolls a candidate with no
-- writes at all, and commit_winner() is the only place that actually
-- records a winner and fires notifications — called from updateCompetition()
-- when the admin saves the competition with a candidate selected. Also adds
-- search_competition_entrants() for the paginated entrant list shown in the
-- admin competition dialog.
drop function if exists public.draw_winner(uuid);

create or replace function public.pick_random_entrant(p_competition_id uuid)
returns table (
  entry_id uuid,
  user_id uuid,
  full_name text,
  email text,
  ticket_numbers integer[]
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status public.competition_status;
  v_existing_winner uuid;
begin
  if not public.is_admin() then
    raise exception 'Admin only';
  end if;

  select status, winner_entry_id into v_status, v_existing_winner
  from public.competitions
  where id = p_competition_id;

  if not found then
    raise exception 'Competition not found';
  end if;

  if v_existing_winner is not null then
    raise exception 'This competition already has a winner';
  end if;

  if v_status <> 'closed' then
    raise exception 'Competition must be closed before drawing a winner';
  end if;

  return query
  select e.id, e.user_id, p.full_name, p.email, e.ticket_numbers
  from public.entries e
  join public.profiles p on p.id = e.user_id
  where e.competition_id = p_competition_id
  order by random()
  limit 1;
end;
$$;

create or replace function public.commit_winner(p_competition_id uuid, p_entry_id uuid)
returns table (winner_entry_id uuid, winner_user_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status public.competition_status;
  v_existing_winner uuid;
  v_title text;
  v_winner_user_id uuid;
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

  select user_id into v_winner_user_id
  from public.entries
  where id = p_entry_id and competition_id = p_competition_id;

  if v_winner_user_id is null then
    raise exception 'That entry no longer belongs to this competition — draw again';
  end if;

  update public.competitions
  set winner_entry_id = p_entry_id,
      drawn_at = now(),
      status = 'drawn'
  where id = p_competition_id;

  perform public.notify(v_winner_user_id, p_competition_id, 'you_won', v_title);

  perform public.notify(entrant.user_id, p_competition_id, 'competition_drawn', v_title)
  from (
    select distinct user_id from public.entries
    where competition_id = p_competition_id and user_id <> v_winner_user_id
  ) as entrant;

  return query select p_entry_id, v_winner_user_id;
end;
$$;

create or replace function public.search_competition_entrants(
  p_competition_id uuid,
  p_search text default '',
  p_page integer default 1,
  p_page_size integer default 10
)
returns table (
  entry_id uuid,
  user_id uuid,
  full_name text,
  email text,
  ticket_numbers integer[],
  created_at timestamptz,
  total_count bigint
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin only';
  end if;

  if p_page < 1 then
    p_page := 1;
  end if;

  if p_page_size < 1 or p_page_size > 100 then
    p_page_size := 10;
  end if;

  return query
  select e.id, e.user_id, p.full_name, p.email, e.ticket_numbers, e.created_at,
         count(*) over () as total_count
  from public.entries e
  join public.profiles p on p.id = e.user_id
  where e.competition_id = p_competition_id
    and (
      p_search = '' or
      p.full_name ilike '%' || p_search || '%' or
      p.email ilike '%' || p_search || '%'
    )
  order by e.created_at desc
  limit p_page_size
  offset (p_page - 1) * p_page_size;
end;
$$;

-- After running this, verify with:
--   select proname from pg_proc
--   where proname in ('pick_random_entrant', 'commit_winner', 'search_competition_entrants');
-- which should return all three, and:
--   select proname from pg_proc where proname = 'draw_winner';
-- which should return no rows.
