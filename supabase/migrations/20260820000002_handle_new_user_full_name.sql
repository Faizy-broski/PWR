-- handle_new_user() never copied full_name from signup metadata, so every
-- new profile started with full_name null even though app/actions/auth.ts
-- passes { data: { full_name } } to supabase.auth.signUp() — the name a
-- user types at signup was silently dropped until they re-entered it later
-- in account settings.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;
