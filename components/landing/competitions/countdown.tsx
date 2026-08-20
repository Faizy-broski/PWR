"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getTimeLeft(closesAt: string): TimeLeft {
  const diff = new Date(closesAt).getTime() - Date.now();
  if (diff <= 0) return ZERO;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// Returns null until mounted, since the countdown is derived from Date.now()
// and would otherwise mismatch between the server-rendered and hydrated markup.
function useCountdown(closesAt: string) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Deliberate: this first setState is what makes the countdown
    // hydration-safe (server and first client render both show null/ZERO,
    // then the real clock value appears once mounted) — not a pattern that
    // useSyncExternalStore replaces any more safely here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(getTimeLeft(closesAt));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(closesAt)), 1000);
    return () => clearInterval(interval);
  }, [closesAt]);

  return timeLeft;
}

export function Countdown({
  closesAt,
  variant = "stacked",
}: {
  closesAt: string;
  variant?: "stacked" | "inline-dark" | "cards-light";
}) {
  const timeLeft = useCountdown(closesAt) ?? ZERO;

  const units = [
    { label: "Days", short: "d", value: timeLeft.days },
    { label: "Hrs", short: "h", value: timeLeft.hours },
    { label: "Mins", short: "m", value: timeLeft.minutes },
    { label: "Secs", short: "s", value: timeLeft.seconds },
  ];

  if (variant === "cards-light") {
    return (
      <div className="flex gap-2.5">
        {units.map((unit, i) => {
          const isLast = i === units.length - 1;
          return (
            <div
              key={unit.label}
              className={cn(
                "flex w-16 flex-col items-center rounded-lg py-2.5",
                isLast
                  ? "border border-brand-gold-light bg-[#D8A9421A] text-brand-gold-light"
                  : "bg-[#F3F2EE] text-black"
              )}
            >
              <span className="text-xl font-extrabold tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "text-[9px] font-semibold tracking-wide uppercase",
                  isLast ? "text-brand-gold-light/70" : "text-muted-foreground"
                )}
              >
                {unit.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "inline-dark") {
    return (
      <div className="flex items-center gap-1.5">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-1.5">
            <div className="flex items-baseline gap-0.5 rounded-lg border border-brand-gold-dark/50 bg-white/5 px-2.5 py-1.5">
              <span className="text-lg font-bold tabular-nums text-white">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold text-brand-gold-light">
                {unit.short}
              </span>
            </div>
            {i < units.length - 1 ? (
              <span className="text-white/30">:</span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex w-16 flex-col items-center rounded-lg border border-border bg-card py-2"
        >
          <span className="text-xl font-semibold tabular-nums">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase text-muted-foreground">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CompactCountdown({
  closesAt,
  className,
}: {
  closesAt: string;
  className?: string;
}) {
  const timeLeft = useCountdown(closesAt) ?? ZERO;

  return (
    <span className={className}>
      {timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}
      {String(timeLeft.hours).padStart(2, "0")}h{" "}
      {String(timeLeft.minutes).padStart(2, "0")}m{" "}
      {String(timeLeft.seconds).padStart(2, "0")}s
    </span>
  );
}
