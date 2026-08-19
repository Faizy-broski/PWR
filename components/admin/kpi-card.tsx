import { ArrowDown, ArrowUp } from "lucide-react";
import { HoverLift } from "@/components/motion/hover-lift";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  deltaPercent,
  accent = "default",
  className,
}: {
  label: string;
  value: string | number;
  /** Real period-over-period % change, or null when there's no prior-period
   * baseline to compare against (e.g. previous period was zero). */
  deltaPercent: number | null;
  accent?: "gold" | "default";
  className?: string;
}) {
  const up = (deltaPercent ?? 0) >= 0;

  return (
    <HoverLift
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md",
        className,
      )}
    >
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-2xl font-extrabold tracking-tight",
          accent === "gold" ? "text-brand-gold-dark" : "text-foreground",
        )}
      >
        {value}
      </p>
      {deltaPercent !== null && (
        <p
          className={cn(
            "mt-1.5 flex items-center gap-1 text-xs font-medium",
            up ? "text-green-600" : "text-red-600",
          )}
        >
          {up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
          {up ? "+" : ""}
          {deltaPercent.toFixed(1)}%
          <span className="font-normal text-muted-foreground">
            vs last period
          </span>
        </p>
      )}
    </HoverLift>
  );
}
