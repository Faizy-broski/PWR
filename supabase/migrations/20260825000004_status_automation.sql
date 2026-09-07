-- Status automation: a live competition whose closes_at has passed moves to
-- 'closed' on its own, so the admin doesn't have to remember to flip it
-- manually before a winner can be drawn. Drawing itself stays a manual admin
-- action (see draw_winner() in 20260825000003_draw_winner.sql) — this only
-- automates the live -> closed transition.
create or replace function public.close_expired_competitions()
returns void
language sql
security definer
set search_path = public
as $$
  update public.competitions
  set status = 'closed'
  where status = 'live' and closes_at <= now();
$$;

-- Requires the pg_cron extension to be enabled on this project (Database ->
-- Extensions in the Supabase dashboard, or the create extension line below
-- if the project allows enabling it via SQL). If `create extension` fails
-- when you run this, enable pg_cron from the dashboard first, then re-run
-- just the schedule() call below.
create extension if not exists pg_cron with schema extensions;

select cron.schedule(
  'close-expired-competitions',
  '*/5 * * * *',
  $$select public.close_expired_competitions();$$
);

-- After running this migration, verify with:
--   select jobname, schedule, active from cron.job;
-- which should show a 'close-expired-competitions' row scheduled every 5
-- minutes.
