-- Enforces one ticket per user per competition. A DB-level unique
-- constraint is the source of truth (races safely under concurrent
-- requests); purchase_entry() also checks explicitly, after it has taken
-- the competition row lock, so concurrent attempts from the same user
-- serialize into a friendly exception instead of hitting the constraint.
alter table public.entries
  add constraint entries_one_per_user_per_competition unique (competition_id, user_id);

create or replace function public.purchase_entry(
  p_competition_id uuid,
  p_transaction_id uuid,
  p_quantity integer,
  p_answer_correct boolean default true
)
returns table (entry_id uuid, ticket_numbers integer[])
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_total_tickets integer;
  v_tickets_sold integer;
  v_status public.competition_status;
  v_starts_at timestamptz;
  v_txn_status public.transaction_status;
  v_txn_user_id uuid;
  v_txn_competition_id uuid;
  v_first_number integer;
  v_numbers integer[];
  v_entry_id uuid;
begin
  if p_quantity is null or p_quantity < 1 then
    raise exception 'Quantity must be at least 1';
  end if;

  -- The transaction must belong to the caller (or the caller is the service
  -- role, which has no auth.uid()), be paid, and match the competition.
  select user_id, status, competition_id
    into v_txn_user_id, v_txn_status, v_txn_competition_id
  from public.transactions
  where id = p_transaction_id
  for update;

  if not found then
    raise exception 'Transaction not found';
  end if;

  if auth.uid() is not null and v_txn_user_id <> auth.uid() then
    raise exception 'Transaction does not belong to the current user';
  end if;

  if v_txn_status <> 'paid' then
    raise exception 'Transaction is not paid';
  end if;

  if v_txn_competition_id <> p_competition_id then
    raise exception 'Transaction does not match competition';
  end if;

  -- Reject if an entry already exists for this transaction (idempotency —
  -- e.g. a retried Stripe webhook must not double-allocate tickets).
  select entries.id, entries.ticket_numbers into v_entry_id, v_numbers
  from public.entries
  where transaction_id = p_transaction_id;

  if found then
    return query select v_entry_id, v_numbers;
    return;
  end if;

  v_user_id := v_txn_user_id;

  -- Lock the competition row so concurrent purchases serialize.
  select total_tickets, tickets_sold, status, starts_at
    into v_total_tickets, v_tickets_sold, v_status, v_starts_at
  from public.competitions
  where id = p_competition_id
  for update;

  if not found then
    raise exception 'Competition not found';
  end if;

  -- One ticket per user per competition. Checked here (after the
  -- competition row lock) so two concurrent requests from the same user
  -- serialize instead of racing; the unique constraint on entries is the
  -- final backstop.
  if exists (
    select 1 from public.entries
    where competition_id = p_competition_id and user_id = v_user_id
  ) then
    raise exception 'You have already entered this competition';
  end if;

  if v_status <> 'live' then
    raise exception 'Competition is not open for entries';
  end if;

  if v_starts_at > now() then
    raise exception 'Competition has not started yet';
  end if;

  if v_tickets_sold + p_quantity > v_total_tickets then
    raise exception 'Not enough tickets remaining';
  end if;

  v_first_number := v_tickets_sold + 1;
  select array_agg(n) into v_numbers
  from generate_series(v_first_number, v_first_number + p_quantity - 1) as n;

  insert into public.entries (competition_id, user_id, ticket_numbers, answer_correct, transaction_id)
  values (p_competition_id, v_user_id, v_numbers, coalesce(p_answer_correct, true), p_transaction_id)
  returning id into v_entry_id;

  insert into public.tickets (competition_id, number, entry_id)
  select p_competition_id, n, v_entry_id
  from unnest(v_numbers) as n;

  update public.competitions
  set tickets_sold = tickets_sold + p_quantity
  where id = p_competition_id;

  return query select v_entry_id, v_numbers;
end;
$$;
