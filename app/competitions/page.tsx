import { CompetitionGrid } from "@/components/competitions/competition-grid";
import { mockCompetitions } from "@/lib/data/competitions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitions | PWR",
};

export default function CompetitionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Competitions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Every live competition, drawn transparently when it closes.
        </p>
      </div>
      <CompetitionGrid competitions={mockCompetitions} />
    </div>
  );
}
