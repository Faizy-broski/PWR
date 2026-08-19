import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { winners } from "@/lib/data/winners";

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
];

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export function RecentWinners() {
  return (
    <div className="rounded border border-border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-widest text-foreground uppercase">
          Recent winners
        </h2>
        <Link
          href="/winners"
          target="_blank"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          All
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {winners.slice(0, 5).map((winner, index) => (
          <div
            key={`${winner.name}-${winner.wonAt}`}
            className="flex items-center gap-3"
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}
            >
              {initials(winner.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {winner.name}{" "}
                <span className="font-normal text-muted-foreground">
                  · {winner.location}
                </span>
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {winner.prizeLabel} · {winner.drawName}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 uppercase">
              Published
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
