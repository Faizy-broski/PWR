import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KpiCard } from "@/components/admin/kpi-card";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/reveal";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { LiveCompetitionCard } from "@/components/admin/live-competition-card";
import { RecentWinners } from "@/components/admin/recent-winners";
import { MotionButton } from "@/components/admin/motion-button";
import { StatusPill } from "@/components/admin/status-pill";
import { COMPETITION_CATEGORY_LABELS } from "@/lib/types";
import {
  competitionStatusPill,
  formatCountdown,
} from "@/lib/admin/competition-status";
import { ENTRY_STATUS_STYLE } from "@/lib/admin/entry-status";
import { getAllCompetitions } from "@/lib/data/competitions";
import { getAllTransactions, getAllUsers } from "@/lib/data/entries";

const PERIOD_DAYS = 30;

// Real period-over-period % change (trailing 30 days vs the 30 before that),
// not a fabricated number — null when there's no prior-period baseline to
// compare against (division by zero), in which case the card just omits
// the delta line rather than showing a made-up percentage.
function percentDelta(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function countInRange(dates: (string | null)[], start: Date, end: Date) {
  return dates.filter((d) => {
    if (!d) return false;
    const t = new Date(d).getTime();
    return t >= start.getTime() && t < end.getTime();
  }).length;
}

function sumInRange(
  items: { date: string | null; value: number }[],
  start: Date,
  end: Date,
) {
  return items.reduce((sum, item) => {
    if (!item.date) return sum;
    const t = new Date(item.date).getTime();
    return t >= start.getTime() && t < end.getTime() ? sum + item.value : sum;
  }, 0);
}

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// 180 days of {date, revenue, entries} buckets, oldest first — the revenue
// chart slices the tail of this for whichever period is selected client-side.
function buildDailySeries(
  transactions: { transaction: { amount: number; status: string; createdAt: string } }[],
) {
  const days = 180;
  const buckets = new Map<string, { revenue: number; entries: number }>();
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), { revenue: 0, entries: 0 });
  }

  for (const { transaction } of transactions) {
    if (transaction.status !== "paid") continue;
    const key = transaction.createdAt.slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.revenue += transaction.amount;
    bucket.entries += 1;
  }

  return Array.from(buckets.entries()).map(([date, v]) => ({ date, ...v }));
}

export default async function AdminOverviewPage() {
  const [competitions, orders, users] = await Promise.all([
    getAllCompetitions(),
    getAllTransactions(),
    getAllUsers(),
  ]);

  const paidOrders = orders.filter((o) => o.transaction.status === "paid");
  const totalRevenue = paidOrders.reduce(
    (sum, o) => sum + o.transaction.amount,
    0,
  );
  const totalEntries = paidOrders.length;
  const activeCompetitions = competitions.filter(
    (c) => c.status === "live",
  ).length;
  const drawnCompetitions = competitions.filter((c) => c.winnerEntryId);
  const prizesWon = drawnCompetitions.reduce(
    (sum, c) => sum + c.prizeValue,
    0,
  );

  // Real trailing-30-day-vs-prior-30-day comparisons, computed from actual
  // timestamps we already store (transaction dates, competition createdAt/
  // drawnAt, user signup dates) — not invented numbers.
  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setDate(periodStart.getDate() - PERIOD_DAYS);
  const priorStart = new Date(periodStart);
  priorStart.setDate(priorStart.getDate() - PERIOD_DAYS);

  const paidAmounts = paidOrders.map((o) => ({
    date: o.transaction.createdAt,
    value: o.transaction.amount,
  }));
  const revenueDelta = percentDelta(
    sumInRange(paidAmounts, periodStart, now),
    sumInRange(paidAmounts, priorStart, periodStart),
  );
  const entriesDelta = percentDelta(
    countInRange(
      paidOrders.map((o) => o.transaction.createdAt),
      periodStart,
      now,
    ),
    countInRange(
      paidOrders.map((o) => o.transaction.createdAt),
      priorStart,
      periodStart,
    ),
  );
  const competitionsDelta = percentDelta(
    countInRange(
      competitions.map((c) => c.createdAt),
      periodStart,
      now,
    ),
    countInRange(
      competitions.map((c) => c.createdAt),
      priorStart,
      periodStart,
    ),
  );
  const winnersDelta = percentDelta(
    countInRange(
      competitions.map((c) => c.drawnAt),
      periodStart,
      now,
    ),
    countInRange(
      competitions.map((c) => c.drawnAt),
      priorStart,
      periodStart,
    ),
  );
  const customersDelta = percentDelta(
    countInRange(
      users.map((u) => u.createdAt),
      periodStart,
      now,
    ),
    countInRange(
      users.map((u) => u.createdAt),
      priorStart,
      periodStart,
    ),
  );
  const prizesDelta = percentDelta(
    sumInRange(
      competitions.map((c) => ({ date: c.drawnAt, value: c.prizeValue })),
      periodStart,
      now,
    ),
    sumInRange(
      competitions.map((c) => ({ date: c.drawnAt, value: c.prizeValue })),
      priorStart,
      periodStart,
    ),
  );

  const stats = [
    {
      label: "Total revenue",
      value: formatGBP(totalRevenue),
      deltaPercent: revenueDelta,
      accent: "gold",
    },
    {
      label: "Total entries",
      value: totalEntries.toLocaleString(),
      deltaPercent: entriesDelta,
      accent: "default",
    },
    {
      label: "Active competitions",
      value: activeCompetitions,
      deltaPercent: competitionsDelta,
      accent: "gold",
    },
    {
      label: "Total winners",
      value: drawnCompetitions.length,
      deltaPercent: winnersDelta,
      accent: "default",
    },
    {
      label: "Active customers",
      value: users.length.toLocaleString(),
      deltaPercent: customersDelta,
      accent: "default",
    },
    {
      label: "Prizes won",
      value: formatGBP(prizesWon),
      deltaPercent: prizesDelta,
      accent: "gold",
    },
  ] as const;

  const revenueByCompetition = new Map<string, number>();
  for (const { transaction } of paidOrders) {
    revenueByCompetition.set(
      transaction.competitionId,
      (revenueByCompetition.get(transaction.competitionId) ?? 0) +
        transaction.amount,
    );
  }

  const topPerformers = [...competitions]
    .sort(
      (a, b) =>
        (revenueByCompetition.get(b.id) ?? 0) -
        (revenueByCompetition.get(a.id) ?? 0),
    )
    .slice(0, 6);

  const liveCompetitions = competitions
    .filter((c) => c.status === "live")
    .sort((a, b) => b.ticketsSold - a.ticketsSold)
    .slice(0, 3);

  const recentEntries = orders.slice(0, 6);
  const dailySeries = buildDailySeries(orders);

  return (
    <div className="space-y-8">
      <Reveal duration={0.5}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {greeting()}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              PWR Performance Overview
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs border-0">
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Badge>
            {/* <MotionButton>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href="/admin/competitions/new" />}
              >
                <Plus className="size-4" />
                New competition
              </Button>
            </MotionButton> */}
          </div>
        </div>
      </Reveal>

      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <RevealItem key={stat.label}>
            <KpiCard {...stat} className="h-full" />
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <RevenueChart data={dailySeries} />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="rounded border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              Competition performance
            </h2>
            <Link
              href="/admin/competitions"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {topPerformers.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              No competitions yet.
            </p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Competition</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Entries</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Prize value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ending</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.map((competition) => {
                    const pill = competitionStatusPill(competition);
                    return (
                      <TableRow
                        key={competition.id}
                        className="transition-colors hover:bg-brand-gold-light/5"
                      >
                        <TableCell className="max-w-52 truncate font-medium">
                          {competition.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {COMPETITION_CATEGORY_LABELS[competition.category]}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {competition.ticketsSold.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium text-brand-gold-dark">
                          {formatGBP(revenueByCompetition.get(competition.id) ?? 0)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatGBP(competition.prizeValue)}
                        </TableCell>
                        <TableCell>
                          <StatusPill tone={pill.tone}>{pill.label}</StatusPill>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {competition.status === "live"
                            ? formatCountdown(competition.closesAt)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/admin/competitions/${competition.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            View
                            <ArrowRight className="size-3" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Reveal>

      {liveCompetitions.length > 0 && (
        <Reveal delay={0.1}>
          <h2 className="mb-4 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Live competitions
          </h2>
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveCompetitions.map((competition) => (
              <RevealItem key={competition.id}>
                <LiveCompetitionCard competition={competition} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Reveal delay={0.1}>
          <div className="rounded border border-border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-widest text-foreground uppercase">
                Recent entries
              </h2>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                View all entries
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {recentEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No entries yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                        Customer
                      </TableHead>
                      <TableHead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                        Competition
                      </TableHead>
                      <TableHead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                        Entry number
                      </TableHead>
                      <TableHead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                        Amount
                      </TableHead>
                      <TableHead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                        Date
                      </TableHead>
                      <TableHead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEntries.map(
                      ({
                        transaction,
                        competition,
                        customerEmail,
                        customerName,
                        ticketNumbers,
                      }) => {
                        const status = ENTRY_STATUS_STYLE[transaction.status];
                        return (
                          <TableRow
                            key={transaction.id}
                            className="transition-colors hover:bg-brand-gold-light/5"
                          >
                            <TableCell className="font-semibold">
                              {customerName ?? customerEmail}
                            </TableCell>
                            <TableCell className="max-w-40 truncate text-muted-foreground">
                              {competition?.title ?? "Unknown"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {ticketNumbers?.[0]
                                ? `#PW-${ticketNumbers[0]}`
                                : "—"}
                            </TableCell>
                            <TableCell className="font-medium text-brand-gold-dark">
                              {formatGBP(transaction.amount)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(
                                transaction.createdAt,
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </TableCell>
                            <TableCell>
                              <StatusPill tone={status.tone}>
                                {status.label}
                              </StatusPill>
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <RecentWinners />
        </Reveal>
      </div>
    </div>
  );
}
