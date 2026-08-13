import { CompetitionCard } from "@/components/landing/competitions/competition-card";
import type { Competition } from "@/lib/types";

export function CompetitionGrid({
  competitions,
}: {
  competitions: Competition[];
}) {
  if (competitions.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        No competitions to show right now.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {competitions.map((competition) => (
        <CompetitionCard key={competition.id} competition={competition} />
      ))}
    </div>
  );
}
