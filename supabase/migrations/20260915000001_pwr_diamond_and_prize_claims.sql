-- PWR Diamond: free competition, 250 entrants, one free entry each, giving
-- away a 2-night holiday for two. Uses the existing free-competition flow
-- (category 'free' + ticket_price 0, see 20260820000001_free_competition_zero_price.sql).
insert into public.competitions
  (slug, title, description, category, prize_value, ticket_price, total_tickets, tickets_sold, status, images, starts_at, closes_at)
values
  (
    'pwr-diamond',
    'PWR Diamond — 2-Night Holiday for Two',
    'Enter free and you could be jetting off on a 2-night break for two. 250 spots available, one free entry per person — once they''re gone, they''re gone.',
    'free',
    2000, 0, 250, 0, 'live',
    array['/competitions-hero.png'],
    now(),
    now() + interval '30 days'
  )
on conflict (slug) do nothing;

-- PWR Black Diamond is a guaranteed-win marketing page (app/(marketing)/pwr-black-diamond)
-- rather than a raffle competition, so it has no row here. This table captures
-- the shipping details a guaranteed winner submits on the winners page to
-- claim their tech bundle prize (EarPods, MacBook, Powerbank) — modelled on
-- the anonymous-signup tables in 20260907000001_marketing_consent_and_signups.sql.
--
-- Both PWR Diamond and PWR Black Diamond are gated behind having at least one
-- paid (non-free) entry elsewhere on the site — see hasPaidEntry() in
-- lib/data/entries.ts. Claims are tied to the signed-in user (rather than
-- anonymous) so that gate can be enforced server-side and so each user can
-- only claim their one guaranteed prize.
--
-- Written defensively (if not exists / drop+recreate policy) so it can be
-- re-run safely on a project where an earlier, anonymous-only version of
-- this table was already applied by hand via the Supabase SQL editor.
create table if not exists public.prize_claims (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'pwr-black-diamond',
  full_name text not null,
  email text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  postcode text not null,
  created_at timestamptz not null default now()
);

alter table public.prize_claims
  add column if not exists user_id uuid references public.profiles (id) on delete cascade;

-- Backfill guard: fails loudly (rather than silently dropping rows) if a
-- prior anonymous version of this table already collected claims with no
-- user_id to backfill — resolve those manually before re-running.
alter table public.prize_claims alter column user_id set not null;

-- One guaranteed prize per person (matches the copy on the marketing page).
create unique index if not exists prize_claims_user_id_key on public.prize_claims (user_id);

alter table public.prize_claims enable row level security;

drop policy if exists prize_claims_insert_anyone on public.prize_claims;
drop policy if exists prize_claims_select_admin on public.prize_claims;
drop policy if exists prize_claims_insert_self on public.prize_claims;
drop policy if exists prize_claims_select_own_or_admin on public.prize_claims;

create policy prize_claims_insert_self
  on public.prize_claims for insert
  to authenticated
  with check (user_id = auth.uid());

create policy prize_claims_select_own_or_admin
  on public.prize_claims for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());
