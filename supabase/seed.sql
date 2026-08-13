-- Dummy competitions for local development. Runs automatically after
-- migrations on `supabase db reset` (or manually: pipe this file into
-- `supabase db execute` / your SQL editor).
--
-- Every row's slug is prefixed "dummy-" so this file can be re-run safely —
-- it only ever touches rows it created.
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
