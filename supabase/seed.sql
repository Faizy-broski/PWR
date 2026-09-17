-- Dummy competitions for local development. Runs automatically after
-- migrations on `supabase db reset` (or manually: pipe this file into
-- `supabase db execute` / your SQL editor).
--
-- Every row's slug is prefixed "dummy-" so this file can be re-run safely —
-- it only ever touches rows it created.

-- Clear out the pwr-test-* accounts (see the Diamond tier block at the
-- bottom of this file) up front — deleting auth.users cascades to profiles,
-- which cascades to their own transactions/entries/prize_claims.
delete from auth.users where email like 'pwr-test-%@example.com';

-- entries/transactions reference competitions with `on delete restrict`, so
-- the dummy competitions can't be dropped while anything still points at
-- them — not just the pwr-test-* rows above, but any real ticket bought
-- against a dummy competition while manually testing the app. Clear those
-- out by competition (regardless of which user holds them) so this file
-- stays re-runnable. tickets.entry_id is `on delete set null`, so deleting
-- entries first would just orphan ticket rows instead of removing them —
-- delete tickets explicitly instead of relying on that.
delete from public.tickets
where competition_id in (select id from public.competitions where slug like 'dummy-%');
delete from public.entries
where competition_id in (select id from public.competitions where slug like 'dummy-%');
delete from public.transactions
where competition_id in (select id from public.competitions where slug like 'dummy-%');

delete from public.competitions where slug like 'dummy-%';

insert into public.competitions
  (slug, title, description, category, prize_value, ticket_price, total_tickets, tickets_sold, status, images, starts_at, closes_at)
values
  -- Live, already open, plenty of stock left.
  (
    'dummy-porsche-911-gt3',
    'Porsche 911 GT3 + £5,000 Cash',
    'Win a track-ready Porsche 911 GT3 finished in GT Silver, plus £5,000 cash to cover the insurance. Drawn live on our socials the moment the clock hits zero.',
    'gold',
    96000, 2.99, 20000, 14200, 'live',
    array[
      '/competitions-assets/cars/car-1.png',
      '/competitions-assets/cars/car-2.png',
      '/competitions-assets/cars/car-3.png'
    ],
    now() - interval '10 days',
    now() + interval '5 days'
  ),
  -- Live, closing soon, low stock.
  (
    'dummy-cash-alternative-50k',
    '£50,000 Tax-Free Cash',
    'Skip the prize, take the cash. £50,000 tax-free, paid directly to your account within 48 hours of the draw.',
    'free',
    50000, 1.49, 10000, 9100, 'live',
    array[
      '/competitions-assets/cars/car-4.png'
    ],
    now() - interval '6 days',
    now() + interval '2 days'
  ),
  -- Live, mid-range stock, premium tier.
  (
    'dummy-platinum-watch-collection',
    'Platinum Chronograph Watch Collection',
    'A three-piece chronograph collection in solid platinum, individually numbered and boxed.',
    'platinum',
    18500, 4.99, 6000, 2450, 'live',
    array[
      '/competitions-assets/cars/car-5.png',
      '/competitions-assets/cars/car-6.png'
    ],
    now() - interval '3 days',
    now() + interval '10 days'
  ),
  -- Live, VIP tier, just opened.
  (
    'dummy-vip-supercar-weekend',
    'VIP Supercar Track Weekend',
    'A weekend for two at Silverstone: hot laps in a Lamborghini Huracán, garage access, and a private instructor.',
    'vip',
    12000, 9.99, 3000, 640, 'live',
    array[
      '/competitions-assets/cars/car-7.png',
      '/competitions-assets/cars/car-8.png'
    ],
    now() - interval '1 days',
    now() + interval '20 days'
  ),
  -- Live but starts in the future — admin-only per the "not visible until
  -- starts_at" rule (see lib/data/competitions.ts getLiveCompetitions and
  -- the RLS policy in 20260814000001_competitions_hide_future_starts.sql).
  (
    'dummy-scheduled-launch-car',
    'Range Rover Sport + £10,000 Fuel Card',
    'Scheduled to open next week — a brand new Range Rover Sport with a year of fuel covered.',
    'gold',
    88000, 3.49, 15000, 0, 'live',
    array[
      '/competitions-assets/cars/car-1.png',
      '/competitions-assets/cars/car-4.png'
    ],
    now() + interval '7 days',
    now() + interval '21 days'
  ),
  -- Closed — sold out, awaiting draw.
  (
    'dummy-closed-cash-raffle',
    '£25,000 Cash Raffle',
    'Sold out and closed — the draw takes place shortly.',
    'free',
    25000, 1.99, 8000, 8000, 'closed',
    array[
      '/competitions-assets/cars/car-2.png'
    ],
    now() - interval '20 days',
    now() - interval '1 days'
  ),
  -- Drawn — finished, no winner wired up (dummy data, no real entries).
  (
    'dummy-drawn-lifestyle-giveaway',
    'Ooni Pizza Oven + Outdoor Kitchen Bundle',
    'This one has already been drawn. Winner announced on our socials.',
    'platinum',
    3200, 1.49, 4000, 4000, 'drawn',
    array[
      '/competitions-assets/cars/car-3.png'
    ],
    now() - interval '30 days',
    now() - interval '15 days'
  ),
  -- Draft — admin-only, never shown publicly regardless of dates.
  (
    'dummy-draft-idea-yacht',
    'Draft: Weekend Yacht Charter',
    'Work-in-progress listing, not yet published.',
    'vip',
    15000, 5.99, 5000, 0, 'draft',
    array[
      '/competitions-assets/cars/car-6.png'
    ],
    now(),
    now() + interval '30 days'
  );

update public.competitions
set drawn_at = closes_at
where slug = 'dummy-drawn-lifestyle-giveaway';

-- ---------------------------------------------------------------------
-- Diamond tier test accounts (PWR Diamond / PWR Black Diamond gating)
-- ---------------------------------------------------------------------
-- Both pages are gated behind hasPaidEntry() (lib/data/entries.ts): a
-- "paid" transaction with amount > 0 anywhere unlocks the free spot on
-- each. These three accounts cover every state that gate — and the claim
-- flows behind it — can be in, so the modules can be clicked through
-- locally without needing a real Stripe checkout:
--
--   pwr-test-locked@example.com    no paid entry            -> locked
--   pwr-test-unlocked@example.com  one paid entry            -> unlocked,
--                                                                nothing
--                                                                claimed yet
--   pwr-test-claimed@example.com   paid entry + already      -> unlocked,
--                                   holds the PWR Diamond        already
--                                   free entry + already         entered /
--                                   submitted the Black           claimed
--                                   Diamond prize claim
--
-- Password for all three: "pwr-test-password" (local dev only — never
-- reuse this against a hosted project). auth.users is seeded directly
-- since there's no signup flow to script against locally; only the
-- columns every recent GoTrue schema ships with are used, and
-- public.profiles rows are created automatically by the
-- on_auth_user_created trigger (see 20260807000002_functions.sql).
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    'a1a1a1a1-0000-0000-0000-000000000001',
    'authenticated', 'authenticated',
    'pwr-test-locked@example.com',
    crypt('pwr-test-password', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    false, now(), now(),
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1a1a1a1-0000-0000-0000-000000000002',
    'authenticated', 'authenticated',
    'pwr-test-unlocked@example.com',
    crypt('pwr-test-password', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    false, now(), now(),
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1a1a1a1-0000-0000-0000-000000000003',
    'authenticated', 'authenticated',
    'pwr-test-claimed@example.com',
    crypt('pwr-test-password', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    false, now(), now(),
    '', '', '', ''
  );

update public.profiles set full_name = 'PWR Test (Locked)'
where id = 'a1a1a1a1-0000-0000-0000-000000000001';
update public.profiles set full_name = 'PWR Test (Unlocked)'
where id = 'a1a1a1a1-0000-0000-0000-000000000002';
update public.profiles set full_name = 'PWR Test (Claimed)'
where id = 'a1a1a1a1-0000-0000-0000-000000000003';

-- Unlocked + Claimed both need one paid (amount > 0) transaction to pass
-- hasPaidEntry() — this is exactly what a real Stripe-backed checkout would
-- leave behind, minted here against the dummy Porsche competition instead.
insert into public.transactions (user_id, competition_id, amount, status)
select 'a1a1a1a1-0000-0000-0000-000000000002', id, ticket_price, 'paid'
from public.competitions where slug = 'dummy-porsche-911-gt3';

insert into public.transactions (user_id, competition_id, amount, status)
select 'a1a1a1a1-0000-0000-0000-000000000003', id, ticket_price, 'paid'
from public.competitions where slug = 'dummy-porsche-911-gt3';

-- Claimed also already holds their free PWR Diamond entry (a zero-amount
-- "paid" transaction run through purchase_entry(), same as the real free
-- competition checkout flow) and has already submitted their Black Diamond
-- prize claim.
with diamond_txn as (
  insert into public.transactions (user_id, competition_id, amount, status)
  select 'a1a1a1a1-0000-0000-0000-000000000003', id, 0, 'paid'
  from public.competitions where slug = 'pwr-diamond'
  returning id, competition_id
)
select public.purchase_entry(competition_id, id, 1, true) from diamond_txn;

insert into public.prize_claims
  (user_id, source, full_name, email, phone, address_line1, city, postcode)
values (
  'a1a1a1a1-0000-0000-0000-000000000003',
  'pwr-black-diamond',
  'PWR Test (Claimed)',
  'pwr-test-claimed@example.com',
  '07000000000',
  '1 Test Street',
  'London',
  'SW1A 1AA'
);
