-- Non-admins must not be able to see competitions whose starts_at is still
-- in the future, anywhere — including via a direct PostgREST/Supabase
-- client call that bypasses the app-layer starts_at filter in
-- lib/data/competitions.ts. Tighten the select policy to match.
drop policy if exists "competitions_select_public_or_admin" on public.competitions;

create policy "competitions_select_public_or_admin"
  on public.competitions for select
  to anon, authenticated
  using (
    (status <> 'draft' and starts_at <= now())
    or public.is_admin()
  );
