"use client";

import { useEffect, useState } from "react";

function getTimeLeft(closesAt: string) {
  const diff = new Date(closesAt).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ closesAt }: { closesAt: string }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(closesAt));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(closesAt)), 1000);
    return () => clearInterval(interval);
  }, [closesAt]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

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
