# Integration tests

Exercise `purchase_entry()`, `pick_random_entrant()`, `commit_winner()`,
`search_competition_entrants()`, and `close_expired_competitions()`
against a real Postgres instance. Not part of `pnpm test` — they need Docker.

## Run

```
supabase start
pnpm test:integration
supabase stop
```

Uses the fixed local dev service-role key `supabase start` prints (same for
every local Supabase project) unless `SUPABASE_URL` /
`SUPABASE_SERVICE_ROLE_KEY` env vars override it. **Never point this at a
hosted/production project** — it creates and deletes real competitions,
users, and notifications.
