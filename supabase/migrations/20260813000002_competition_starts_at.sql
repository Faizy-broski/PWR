-- Competitions can be scheduled ahead of time: admin sets status = 'live'
-- with a future starts_at, and it stays hidden from public listings until
-- that moment passes (see lib/data/competitions.ts getLiveCompetitions).
alter table public.competitions
  add column starts_at timestamptz not null default now();

alter table public.competitions
  alter column starts_at drop default;

create index competitions_starts_at_idx on public.competitions (starts_at);
