-- Enable RLS on every table. With no policies, access defaults to deny for
-- all roles except service_role (which always bypasses RLS).
alter table public.profiles enable row level security;
alter table public.competitions enable row level security;
alter table public.transactions enable row level security;
alter table public.entries enable row level security;
alter table public.tickets enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
-- Row creation happens only via the handle_new_user trigger (security
-- definer), so there is intentionally no insert policy for regular users.

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- competitions
-- ---------------------------------------------------------------------------
create policy "competitions_select_public_or_admin"
  on public.competitions for select
  to anon, authenticated
  using (status <> 'draft' or public.is_admin());

create policy "competitions_insert_admin"
  on public.competitions for insert
  to authenticated
  with check (public.is_admin());

create policy "competitions_update_admin"
  on public.competitions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "competitions_delete_admin"
  on public.competitions for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- transactions
-- ---------------------------------------------------------------------------
-- Rows are written by the server (service role) after Stripe confirms
-- payment, so regular users only ever read their own transactions.
create policy "transactions_select_own_or_admin"
  on public.transactions for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "transactions_insert_admin"
  on public.transactions for insert
  to authenticated
  with check (public.is_admin());

create policy "transactions_update_admin"
  on public.transactions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- entries
-- ---------------------------------------------------------------------------
-- Rows are written by the server after a paid transaction, so regular users
-- only read their own entries.
create policy "entries_select_own_or_admin"
  on public.entries for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "entries_insert_admin"
  on public.entries for insert
  to authenticated
  with check (public.is_admin());

create policy "entries_update_admin"
  on public.entries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- tickets
-- ---------------------------------------------------------------------------
create policy "tickets_select_own_or_admin"
  on public.tickets for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.entries
      where entries.id = tickets.entry_id
        and entries.user_id = auth.uid()
    )
  );

create policy "tickets_insert_admin"
  on public.tickets for insert
  to authenticated
  with check (public.is_admin());

create policy "tickets_update_admin"
  on public.tickets for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
