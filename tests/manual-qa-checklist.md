# Manual QA checklist

Run this against a real environment (staging ideally; production if that's
what's available) after applying the new migrations. Each item should be
checked once by hand since it can't be driven from this sandbox.

## Auth

- [ ] Sign up with a new email — profile row is created, redirected correctly
- [ ] Log in as a regular user — redirected to `/`
- [ ] Log in as an admin (`profiles.is_admin = true`) — redirected to `/admin`
- [ ] Log out
- [ ] Forgot password — request reset email arrives (Supabase Auth's own
      email, unaffected by this work), reset link works
- [ ] Reset password with the emailed link, then log in with the new password

## Purchase / entry flow

- [ ] Enter a `free`-category live competition — redirected to the
      confirmation page with a ticket number
- [ ] Try entering the same competition again as the same user — blocked
      with "You've already entered this competition."
- [ ] Check the admin bell (top right of `/admin`) — a new "Entry confirmed"
      notification appears for that purchase
- [ ] Enter a competition until `tickets_sold` reaches `total_tickets` —
      further entries are rejected ("Not enough tickets remaining")

## Status automation

- [ ] Create/edit a competition with `status = live` and `closes_at` a
      few minutes in the future
- [ ] Wait past `closes_at` (cron runs every 5 minutes) — confirm status
      flips to `closed` on its own, without editing it manually
- [ ] In the Supabase SQL editor: `select jobname, schedule, active from
      cron.job;` — confirms the `close-expired-competitions` job is present
      and active

## Entrant list

- [ ] Open any competition (any status — draft/live/closed/drawn) in
      `/admin/competitions/[id]` — the "Entrants" section shows everyone
      who's entered, with name, email, ticket number(s), entered date
- [ ] Type a search term matching a name/email — list narrows to matches
      (server round trip, ~300ms debounce)
- [ ] Search for something that matches nobody — "No entrants match your
      search." shown
- [ ] With more than 10 entrants, pagination controls appear — Next/Prev
      move through pages correctly and disable at the ends

## Winner selection (draw, re-draw, commit on save)

- [ ] Open a `closed` competition with several entries — a "Draw" button
      appears under Winner (no candidate yet)
- [ ] Click "Draw" — a candidate appears ("Candidate: NAME, Ticket #X — Not
      final until you save"); **nothing is written to the DB yet** (refresh
      the page — candidate is gone, competition still `closed`, no winner)
- [ ] Click "Draw again" several times — the candidate changes/re-rolls each
      time, still nothing persisted
- [ ] Click **Save** with a candidate selected — competition becomes
      `drawn`, the picked candidate is recorded as the winner, and no
      notifications fired during the earlier re-draws — only now
- [ ] Reopen the competition — read-only "Winner" panel shown (name, ticket,
      drawn date), no draw controls, no way to re-draw
- [ ] Open a `closed` competition with **no** entries — clicking "Draw" is
      rejected ("No entries to draw from")
- [ ] Two admins (or two tabs) open the same `closed` competition, both draw
      candidates, one saves first — the second admin's save is rejected
      ("Competition details saved, but the winner could not be recorded:
      This competition already has a winner")
- [ ] Check the winning user's admin bell notification — "You won" appears
      (only after save, not during re-drawing)
- [ ] Check a non-winning entrant's row in `notifications` (table view; no
      customer-facing UI reads this yet) — "Draw complete" / competition_drawn
      logged for them too, only after save
- [ ] Homepage "Real People. Real Wins." section and the winners ticker show
      the real winner (name + prize), not the old sample names

## Admin dashboard & notifications templates

- [ ] `/admin` — KPI cards, revenue chart, competition performance table,
      recent entries, and "Recent winners" all show real numbers (no more
      hardcoded winner names)
- [ ] `/admin/notifications` — edit a template's title/body, save, confirm
      it persists after a refresh
- [ ] Trigger a fresh entry — confirm the new notification uses the edited
      template text, not the old one

## Regression

- [ ] `pnpm build` succeeds
- [ ] `pnpm test` is green
- [ ] Existing admin pages (Competitions, Orders, Customers) still load and
      look unchanged
