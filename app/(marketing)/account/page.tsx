import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings as SettingsIcon,
  Sparkles,
  Ticket,
  Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HoverLift } from "@/components/motion/hover-lift";
import { AccountSettingsTab } from "@/components/account/account-settings-tab";
import { logout } from "@/app/actions/auth";
import { getAccountData } from "@/app/actions/account";
import { requireUser } from "@/lib/supabase/dal";
import { cn } from "@/lib/utils";

const STATUS_VARIANT = {
  paid: "default",
  pending: "secondary",
  failed: "destructive",
  refunded: "secondary",
} as const;

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default async function AccountPage() {
  const profile = await requireUser();
  const { entries, transactions } = await getAccountData();

  const fullName = profile.full_name ?? "";
  const email = profile.email;
  const phone = profile.phone ?? "";
  const isAdmin = profile.is_admin;
  const memberSince = new Date(profile.created_at).toLocaleDateString(
    "en-GB",
    { month: "long", year: "numeric" },
  );

  const activeEntries = entries.filter(
    (e) => e.competition?.status === "live",
  );
  const ticketsHeld = entries.reduce(
    (sum, e) => sum + e.entry.ticketNumbers.length,
    0,
  );
  const totalSpent = transactions.reduce(
    (sum, t) => (t.transaction.status === "paid" ? sum + t.transaction.amount : sum),
    0,
  );

  const stats = [
    { label: "Active entries", value: activeEntries.length, icon: Sparkles },
    { label: "Tickets held", value: ticketsHeld, icon: Ticket },
    { label: "Total spent", value: formatGBP(totalSpent), icon: Wallet },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-128 overflow-hidden"
      >
        <div className="absolute -top-40 -left-32 size-96 rounded-full bg-brand-gold-light/25 blur-3xl" />
        <div className="absolute -top-24 right-0 size-112 rounded-full bg-brand-gold-dark/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 pt-28 pb-24 sm:px-6 sm:pt-32 lg:pt-36">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-brand-gradient p-0.75 shadow-lg shadow-brand-gold-dark/20">
                <Avatar size="lg" className="size-16 bg-white">
                  <AvatarFallback className="bg-white text-xl font-bold text-brand-gold-dark">
                    {initials(fullName || email)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {fullName || email}
                  </h1>
                  {isAdmin && (
                    <Badge variant="outline" className="shrink-0 border-brand-gold-dark/30 text-[10px] text-brand-gold-dark">
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {email} &middot; Member since {memberSince}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/admin" />}
                >
                  <LayoutDashboard className="size-4" />
                  Admin panel
                </Button>
              )}
              <form action={logout}>
                <Button type="submit" variant="ghost">
                  <LogOut className="size-4" />
                  Log out
                </Button>
              </form>
            </div>
          </div>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <RevealItem key={label}>
              <HoverLift className="group flex items-center gap-4 rounded-3xl border border-border bg-white p-5 shadow-sm ring-1 ring-black/2 transition-shadow duration-300 hover:shadow-lg">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {label}
                  </p>
                  <p className="mt-0.5 truncate text-2xl font-extrabold tracking-tight text-foreground">
                    {value}
                  </p>
                </div>
              </HoverLift>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-12">
          <Tabs defaultValue="entries">
            <TabsList variant="line" className="border-b border-border">
              <TabsTrigger value="entries" className="gap-1.5">
                <Ticket className="size-3.5" />
                Entries
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-1.5">
                <Receipt className="size-3.5" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5">
                <SettingsIcon className="size-3.5" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entries" className="mt-6">
              {entries.length === 0 ? (
                <Empty icon={Ticket} label="No entries yet." />
              ) : (
                <RevealGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {entries.map(({ entry, competition }) => (
                    <RevealItem key={entry.id}>
                      <HoverLift className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm ring-1 ring-black/2 transition-shadow duration-300 hover:shadow-lg">
                        <div className="flex items-center gap-3 p-4">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                            {competition?.images[0] && (
                              <Image
                                src={competition.images[0]}
                                alt=""
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {competition?.title ?? "Unknown competition"}
                              </p>
                              <Badge
                                variant={
                                  competition?.status === "live"
                                    ? "default"
                                    : "secondary"
                                }
                                className="shrink-0"
                              >
                                {competition?.status === "live" ? "Live" : "Closed"}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Tickets:{" "}
                              <span className="font-medium text-foreground">
                                {entry.ticketNumbers.join(", ")}
                              </span>
                            </p>
                          </div>
                        </div>
                      </HoverLift>
                    </RevealItem>
                  ))}
                </RevealGroup>
              )}
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              {transactions.length === 0 ? (
                <Empty icon={Receipt} label="No orders yet." />
              ) : (
                <RevealGroup className="space-y-3">
                  {transactions.map(({ transaction, competition }) => (
                    <RevealItem key={transaction.id}>
                      <HoverLift className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm ring-1 ring-black/2 transition-shadow duration-300 hover:shadow-lg">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                            <Receipt className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {competition?.title ?? "Unknown competition"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleDateString(
                                "en-GB",
                                { day: "numeric", month: "short", year: "numeric" },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-foreground">
                            {formatGBP(transaction.amount)}
                          </p>
                          <Badge
                            variant={STATUS_VARIANT[transaction.status]}
                            className="mt-1"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </HoverLift>
                    </RevealItem>
                  ))}
                </RevealGroup>
              )}
            </TabsContent>

            <TabsContent value="settings" className="mt-6 max-w-lg">
              <AccountSettingsTab fullName={fullName} email={email} phone={phone} />
            </TabsContent>
          </Tabs>
        </Reveal>
      </div>
    </div>
  );
}

function Empty({
  icon: Icon,
  label,
}: {
  icon: typeof Ticket;
  label: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-muted/30 py-20 text-center",
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
