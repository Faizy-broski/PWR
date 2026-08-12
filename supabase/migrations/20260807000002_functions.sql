-- Creates a profile row automatically whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Security-definer helper so RLS policies can check admin status without
-- recursively evaluating the profiles table's own RLS policies.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Prevents a signed-in user from granting themselves admin by editing their
-- own profile row; only a service-role connection (which bypasses triggers
-- run as the invoking role's privileges are unaffected, but session_user
-- stays 'authenticated' for normal clients) can flip is_admin.
create or replace function public.protect_is_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_admin is distinct from old.is_admin and auth.role() <> 'service_role' then
    new.is_admin := old.is_admin;
  end if;
  return new;
end;
$$;

create trigger protect_profiles_is_admin
  before update on public.profiles
  for each row execute function public.protect_is_admin();
