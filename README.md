# PWR

Custom platform for PWR's online prize competitions, replacing the temporary
Wix site. Members pay to enter prize competitions (cars, tech, cash) and
winners are drawn from valid entries when a competition closes.

## Stack

| Layer      | Technology                         |
| ---------- | ----------------------------------- |
| Frontend   | Next.js (App Router)                |
| UI         | shadcn/ui, Tailwind CSS, motion      |
| Backend/DB | Supabase (Auth, Database, Storage)   |
| Payments   | Stripe (planned)                    |

## Project structure

```
app/
  (auth)/login, (auth)/sign-up   Auth pages
  competitions/                  Public browsing + detail + checkout
  dashboard/                     Member area (entries, orders, settings)
  admin/                         Admin area (competition CRUD, orders, users)
components/
  ui/                            shadcn/ui primitives
  layout/                        Navbar, footer
  competitions/                  Competition card, grid, countdown
  dashboard/, admin/             Section-specific nav and forms
lib/
  supabase/                      Browser/server/middleware Supabase clients
  data/                          Mock data (swap for Supabase queries)
  types.ts                       Domain types (Competition, Entry, Ticket, Transaction, Profile)
```

## Getting started

```bash
pnpm install
cp .env.local.example .env.local   # fill in Supabase + Stripe keys
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- `lib/data/competitions.ts` currently returns mock data. Once the Supabase
  schema (`competitions`, `entries`, `tickets`, `transactions`, `profiles`)
  is created, replace it with real queries via `lib/supabase/server.ts`.
- Regenerate Supabase types into `lib/supabase/types.ts` with:
  `pnpm dlx supabase gen types typescript --project-id <id> > lib/supabase/types.ts`
- `middleware.ts` refreshes the Supabase session cookie on every request.
