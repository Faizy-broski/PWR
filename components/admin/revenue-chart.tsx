"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type Point = { date: string; revenue: number; entries: number };

const PERIODS = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "3m", label: "3 months", days: 90 },
  { key: "6m", label: "6 months", days: 180 },
] as const;

const WIDTH = 640;
const HEIGHT = 200;
const PAD = 8;

function buildPath(values: number[]) {
  if (values.length === 0) return "";
  const max = Math.max(...values, 1);
  const stepX = (WIDTH - PAD * 2) / Math.max(values.length - 1, 1);

  return values
    .map((v, i) => {
      const x = PAD + i * stepX;
      const y = HEIGHT - PAD - (v / max) * (HEIGHT - PAD * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function RevenueChart({ data }: { data: Point[] }) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["key"]>("30d");
  const revenuePathRef = useRef<SVGPathElement>(null);
  const entriesPathRef = useRef<SVGPathElement>(null);

  const visible = useMemo(() => {
    const days = PERIODS.find((p) => p.key === period)!.days;
    return data.slice(-days);
  }, [data, period]);

  const revenuePath = useMemo(
    () => buildPath(visible.map((p) => p.revenue)),
    [visible],
  );
  const entriesPath = useMemo(
    () => buildPath(visible.map((p) => p.entries)),
    [visible],
  );

  const totalRevenue = visible.reduce((sum, p) => sum + p.revenue, 0);
  const totalEntries = visible.reduce((sum, p) => sum + p.entries, 0);

  useEffect(() => {
    const revenueEl = revenuePathRef.current;
    const entriesEl = entriesPathRef.current;
    if (!revenueEl || !entriesEl) return;

    const ctx = gsap.context(() => {
      const length = revenueEl.getTotalLength();
      gsap.fromTo(
        revenueEl,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 1, ease: "power2.out" },
      );

      // Entries line keeps its own dashed pattern (set via JSX), so it only
      // fades in rather than "drawing" like the revenue line above.
      gsap.fromTo(
        entriesEl,
        { opacity: 0 },
        { opacity: 0.5, duration: 0.8, delay: 0.2, ease: "power1.out" },
      );
    });

    return () => ctx.revert();
  }, [revenuePath, entriesPath]);

  return (
    <div className="rounded border border-border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Revenue overview
          </h2>
          <div className="mt-1 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-brand-gold-dark" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full border-2 border-dashed border-muted-foreground" />
              Entries
            </span>
          </div>
        </div>

        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
                period === p.key
                  ? "bg-brand-gradient text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-6">
        <div>
          <p className="text-2xl font-extrabold tabular-nums">
            {new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: "GBP",
              maximumFractionDigits: 0,
            }).format(totalRevenue)}
          </p>
          <p className="text-xs text-muted-foreground">
            Revenue in this period
          </p>
        </div>
        <div>
          <p className="text-2xl font-extrabold tabular-nums">
            {totalEntries.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Entries in this period</p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-4 h-48 w-full"
        preserveAspectRatio="none"
      >
        <path
          ref={entriesPathRef}
          d={entriesPath}
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth={2}
          strokeDasharray="4 4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.5}
        />
        <path
          ref={revenuePathRef}
          d={revenuePath}
          fill="none"
          stroke="var(--brand-gold-dark)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
