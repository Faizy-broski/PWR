"use client";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

// No genuine winner-count/prize-value/years-running figures exist yet at
// launch — showing invented numbers as brand history would misrepresent
// PWR (see AGENTS.md item 24). These stay qualitative until real data
// backs them.
export const defaultBrandStats: StatItem[] = [
  { icon: "/svg's/trophy.svg", value: "Real Prizes", label: "Every Draw" },
  { icon: "/svg's/star.svg", value: "Fully Transparent", label: "Fair Draws" },
  { icon: "/svg's/gift.svg", value: "5% Committed", label: "To Community" },
];

export function StatsRow({
  stats = defaultBrandStats,
  className,
}: {
  stats?: StatItem[];
  className?: string;
}) {
  return (
    <RevealGroup
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10",
        className
      )}
    >
      {stats.map(({ icon, value, label }, i) => (
        <RevealItem key={label} className="flex items-center gap-8 sm:gap-10">
          <div className="flex items-center gap-8 sm:gap-10">
            {i > 0 ? (
              <span
                aria-hidden
                className="hidden h-8 w-px bg-white/10 sm:block"
              />
            ) : null}
            <div className="flex items-center gap-2.5">
              <img src={icon} alt="" className="size-8" />
              <span className="flex flex-col items-start leading-tight">
                <span className="text-sm text-white sm:text-[16px]">
                  {value}
                </span>
                <span className="text-[11px] font-medium tracking-wide text-white uppercase">
                  {label}
                </span>
              </span>
            </div>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
