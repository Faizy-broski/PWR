-- Extensions
create extension if not exists pgcrypto;

-- Enums
create type public.competition_status as enum ('draft', 'live', 'closed', 'drawn');
create type public.transaction_status as enum ('pending', 'paid', 'failed', 'refunded');

-- profiles: one row per auth.users row, created by trigger on signup
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- competitions
create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  prize_value numeric(12, 2) not null check (prize_value >= 0),
  ticket_price numeric(10, 2) not null check (ticket_price > 0),
  total_tickets integer not null check (total_tickets > 0),
  tickets_sold integer not null default 0 check (tickets_sold >= 0),
  status public.competition_status not null default 'draft',
  images text[] not null default '{}',
  closes_at timestamptz not null,
  drawn_at timestamptz,
  winner_entry_id uuid,
  created_at timestamptz not null default now(),
  constraint tickets_sold_within_total check (tickets_sold <= total_tickets)
);

-- transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  competition_id uuid not null references public.competitions (id) on delete restrict,
  amount numeric(10, 2) not null check (amount >= 0),
  currency text not null default 'GBP',
  status public.transaction_status not null default 'pending',
  stripe_payment_intent_id text unique,
  created_at timestamptz not null default now()
);

-- entries
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions (id) on delete restrict,
  user_id uuid not null references public.profiles (id) on delete cascade,
  ticket_numbers integer[] not null default '{}',
  answer_correct boolean not null default false,
  transaction_id uuid not null references public.transactions (id) on delete restrict,
  created_at timestamptz not null default now()
);

-- Now that entries exists, wire up the winner reference on competitions.
alter table public.competitions
  add constraint competitions_winner_entry_id_fkey
  foreign key (winner_entry_id) references public.entries (id) on delete set null;

-- tickets: individual numbered tickets per competition
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions (id) on delete cascade,
  number integer not null check (number > 0),
  entry_id uuid references public.entries (id) on delete set null,
  unique (competition_id, number)
);

-- Indexes
create index competitions_status_idx on public.competitions (status);
create index competitions_closes_at_idx on public.competitions (closes_at);
create index transactions_user_id_idx on public.transactions (user_id);
create index transactions_competition_id_idx on public.transactions (competition_id);
create index entries_user_id_idx on public.entries (user_id);
create index entries_competition_id_idx on public.entries (competition_id);
create index tickets_competition_id_idx on public.tickets (competition_id);
create index tickets_entry_id_idx on public.tickets (entry_id);
