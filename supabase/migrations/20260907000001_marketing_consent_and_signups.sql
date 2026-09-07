-- Marketing consent on profiles: members opt in explicitly at signup rather
-- than being automatically subscribed (see AGENTS.md item 15).
alter table public.profiles
  add column marketing_email_consent boolean not null default false,
  add column marketing_sms_consent boolean not null default false;

-- handle_new_user() now also copies phone + the two consent flags from the
-- signup metadata (app/actions/auth.ts passes all four in options.data).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, full_name, phone,
    marketing_email_consent, marketing_sms_consent
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_user_meta_data ->> 'marketing_email_consent')::boolean, false),
    coalesce((new.raw_user_meta_data ->> 'marketing_sms_consent')::boolean, false)
  );
  return new;
end;
$$;

-- Standalone newsletter/update signups (anonymous — no account required).
-- Marketing-API sync is parked per AGENTS.md item 27; this table is the
-- system of record until that integration is agreed.
create table public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  consented_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

alter table public.newsletter_signups enable row level security;

create policy newsletter_signups_insert_anyone
  on public.newsletter_signups for insert
  to anon, authenticated
  with check (true);

create policy newsletter_signups_select_admin
  on public.newsletter_signups for select
  to authenticated
  using (public.is_admin());

-- "Get Notified" signups for coming-soon tiers (Platinum/VIP).
create table public.tier_notify_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  tier public.competition_category not null,
  created_at timestamptz not null default now(),
  unique (email, tier)
);

alter table public.tier_notify_signups enable row level security;

create policy tier_notify_signups_insert_anyone
  on public.tier_notify_signups for insert
  to anon, authenticated
  with check (true);

create policy tier_notify_signups_select_admin
  on public.tier_notify_signups for select
  to authenticated
  using (public.is_admin());
