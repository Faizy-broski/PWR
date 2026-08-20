-- Free-category competitions can have a zero entry fee (ticket_price was
-- previously required to be strictly positive for every category). App-level
-- validation still requires a positive price for paid categories — see the
-- refine() in app/actions/competitions.ts — this just relaxes the DB-level
-- floor to match.
alter table public.competitions
  drop constraint competitions_ticket_price_check;

alter table public.competitions
  add constraint competitions_ticket_price_check check (ticket_price >= 0);
