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
| Payments   | Stripe (planned — mock "pay now" flow until keys are set) |

## Project structure

There's no separate member dashboard — logged-in members are embedded in the
public pages via the Account Sheet (opened from the navbar avatar), Instagram/
Facebook-style. Only admins get a dedicated section (`/admin`).

```
app/
  (marketing)/                   Public chrome (Navbar/Footer) wraps:
    page.tsx                     Home
    competitions/                Public browsing + detail + checkout
    (auth)/login, (auth)/sign-up Auth pages
  admin/                         Admin area (competition CRUD, orders, users)
  actions/                       Server actions (auth, competitions, checkout, account, profile)
components/
  ui/                            shadcn/ui primitives
  layout/                        Navbar, footer
  account/                       Account Sheet, profile form, stat card (used in navbar + /admin)
  admin/                         Admin nav + competition form
  landing/competitions/          Competition cards, filters, countdown
lib/
  supabase/                      Browser/server/service-role Supabase clients, DAL (auth/role checks)
  data/                          Supabase queries (competitions, entries, transactions)
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

- Apply `supabase/migrations/*.sql` in filename order via the Supabase SQL
  editor or a linked `supabase db push`. `purchase_entry` (ticket allocation)
  and the `starts_at` column must both be applied before checkout/scheduling
  will work.
- `purchase_entry` is a `security definer` Postgres function that atomically
  allocates sequential ticket numbers under a row lock — this is what
  prevents duplicate/oversold tickets, not application code.
- A competition can be `status = 'live'` with a future `starts_at` to
  schedule it; it's hidden from public listings and blocked from purchase
  until that time passes (checked in both the server action and the SQL
  function).
- Regenerate Supabase types into `lib/supabase/types.ts` with:
  `pnpm dlx supabase gen types typescript --project-id <id> > lib/supabase/types.ts`
  (currently hand-written to match the migrations — no CLI project link yet).
- `proxy.ts` (Next 16's renamed `middleware.ts`) refreshes the Supabase
  session cookie and optimistically redirects around `/admin` and the auth
  pages; the real, DB-backed authorization gate is `lib/supabase/dal.ts`.
