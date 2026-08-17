import { cn } from "@/lib/utils";
import { WinnerCard, type Winner } from "./winners-card";

export function WinnersGrid({
  winners,
  className,
}: {
  winners: Winner[];
  className?: string;
}) {
  if (winners.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-black/40">
        No winners found for this filter.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {winners.map((winner) => (
        <WinnerCard key={winner.id} winner={winner} />
      ))}
    </div>
  );
}