import Link from "next/link";
import { ArrowRight, Trophy, Wallet, ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/account/stat-card";
import { getAllCompetitions } from "@/lib/data/competitions";
import { getAllTransactions } from "@/lib/data/entries";

export default async function AdminOverviewPage() {
  const [competitions, orders] = await Promise.all([
    getAllCompetitions(),
    getAllTransactions(),
  ]);

  const today = new Date().toDateString();
  const paidToday = orders.filter(
    (o) =>
      o.transaction.status === "paid" &&
      new Date(o.transaction.createdAt).toDateString() === today,
  );
  const totalRevenue = orders
    .filter((o) => o.transaction.status === "paid")
    .reduce((sum, o) => sum + o.transaction.amount, 0);

  const stats = [
    {
      label: "Live competitions",
      value: competitions.filter((c) => c.status === "live").length,
      icon: Trophy,
      hint: `${competitions.length} total`,
    },
    {
      label: "Total revenue",
      value: new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(totalRevenue),
      icon: Wallet,
    },
    {
      label: "Orders today",
      value: paidToday.length,
      icon: ShoppingCart,
      hint: `${orders.length} all time`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl bg-brand-gradient p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/70">
            Admin
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Overview
          </h1>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Manage competitions, orders, and users.
          </p>
        </div>
        <Button
          variant="outline-transparent"
          nativeButton={false}
          render={<Link href="/admin/competitions/new" />}
        >
          <Plus className="size-4" />
          New competition
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {orders.slice(0, 5).map(({ transaction, competition, customerEmail }) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {competition?.title ?? "Unknown competition"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {customerEmail}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold">
                  {new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  }).format(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
