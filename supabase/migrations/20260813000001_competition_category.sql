-- Adds the PWR competition category tier. Every competition is assigned a
-- category by the admin at creation time (see AGENTS/requirements: "Admin
-- has to tell which category is this competition").
create type public.competition_category as enum ('free', 'gold', 'platinum', 'vip');

alter table public.competitions
  add column category public.competition_category not null default 'free';

alter table public.competitions
  alter column category drop default;

create index competitions_category_idx on public.competitions (category);
