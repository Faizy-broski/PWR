import type { Winner } from "@/lib/data/winners";
import { cn } from "@/lib/utils";

function formatWonAt(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(value))
    .toUpperCase();
}

export function WinnerCard({
  winner,
  highlighted = false,
  className,
}: {
  winner: Winner;
  highlighted?: boolean;
  className?: string;
}) {
  const { name, location, prizeLabel, drawName, wonAt } = winner;

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-6 rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1",
        highlighted
          ? "border-transparent bg-brand-gradient text-white shadow-md"
          : "border-border bg-card text-card-foreground",
        className
      )}
    >
      <span
        className={cn(
          "text-[11px] font-semibold tracking-widest uppercase",
          highlighted ? "text-white/70" : "text-muted-foreground"
        )}
      >
        {formatWonAt(wonAt)}
      </span>

      <h3 className="text-lg font-extrabold tracking-tight uppercase">
        {name} <span className="opacity-60">—</span> {location}
      </h3>

      <div className="mt-auto">
        <span
          className={cn(
            "text-[11px] font-semibold tracking-widest uppercase",
            highlighted ? "text-white/70" : "text-muted-foreground"
          )}
        >
          Won
        </span>
        <p
          className={cn(
            "mt-1 text-xl font-bold",
            highlighted ? "text-white" : "text-brand-gold-dark"
          )}
        >
          {prizeLabel}
        </p>
        <p
          className={cn(
            "mt-1 text-sm",
            highlighted ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {drawName}
        </p>
      </div>
    </div>
  );
}
