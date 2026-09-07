// Pure reporting helpers used by the admin overview page
// (app/admin/page.tsx). Extracted so they're unit-testable without
// rendering the page.

// Real period-over-period % change (trailing 30 days vs the 30 before that),
// not a fabricated number — null when there's no prior-period baseline to
// compare against (division by zero), in which case the caller should omit
// the delta line rather than showing a made-up percentage.
export function percentDelta(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function countInRange(dates: (string | null)[], start: Date, end: Date) {
  return dates.filter((d) => {
    if (!d) return false;
    const t = new Date(d).getTime();
    return t >= start.getTime() && t < end.getTime();
  }).length;
}

export function sumInRange(
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

// 180 days of {date, revenue, entries} buckets, oldest first — the revenue
// chart slices the tail of this for whichever period is selected client-side.
export function buildDailySeries(
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
