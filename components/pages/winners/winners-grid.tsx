import { cn } from "@/lib/utils";
import { WinnerCard, type Winner } from "./winners-card";
import { WinnersEmptyState } from "./winners-empty-state";

export function WinnersGrid({
  winners,
  className,
}: {
  winners: Winner[];
  className?: string;
}) {
  if (winners.length === 0) {
    return (
      <WinnersEmptyState
        title="No winners found"
        description="Try a different category or search term."
      />
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
