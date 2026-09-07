import { describe, it, expect } from "vitest";
import {
  percentDelta,
  countInRange,
  sumInRange,
  buildDailySeries,
} from "./reporting";

describe("percentDelta", () => {
  it("returns null when there's no prior-period baseline", () => {
    expect(percentDelta(100, 0)).toBeNull();
  });

  it("computes the percentage change", () => {
    expect(percentDelta(150, 100)).toBe(50);
    expect(percentDelta(50, 100)).toBe(-50);
  });
});

describe("countInRange", () => {
  const start = new Date("2026-01-01T00:00:00.000Z");
  const end = new Date("2026-01-31T00:00:00.000Z");

  it("counts dates within [start, end)", () => {
    const dates = [
      "2026-01-15T00:00:00.000Z",
      "2025-12-31T00:00:00.000Z",
      "2026-01-31T00:00:00.000Z",
      null,
    ];
    expect(countInRange(dates, start, end)).toBe(1);
  });
});

describe("sumInRange", () => {
  it("sums values whose date falls in range, ignoring null dates", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const end = new Date("2026-01-31T00:00:00.000Z");
    const items = [
      { date: "2026-01-10T00:00:00.000Z", value: 10 },
      { date: "2025-12-01T00:00:00.000Z", value: 999 },
      { date: null, value: 5 },
    ];
    expect(sumInRange(items, start, end)).toBe(10);
  });
});

describe("buildDailySeries", () => {
  it("buckets only paid transactions by day, ignoring others", () => {
    const today = new Date().toISOString().slice(0, 10);
    const transactions = [
      {
        transaction: { amount: 20, status: "paid", createdAt: `${today}T09:00:00.000Z` },
      },
      {
        transaction: { amount: 999, status: "pending", createdAt: `${today}T09:00:00.000Z` },
      },
    ];

    const series = buildDailySeries(transactions);
    const todayBucket = series.find((b) => b.date === today);

    expect(series).toHaveLength(180);
    expect(todayBucket).toEqual({ date: today, revenue: 20, entries: 1 });
  });
});
