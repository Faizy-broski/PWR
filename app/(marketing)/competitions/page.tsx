import type { Metadata } from "next";
import { CompetitionsHero } from "@/components/pages/competitions/competitions-hero";
import { CompetitionsCatalog } from "@/components/pages/competitions/competitions-catalog";
import {
  getLiveCompetitions,
  toFeaturedCompetition,
} from "@/lib/data/competitions";
import { getMyEntryMap } from "@/lib/data/entries";

export const metadata: Metadata = {
  title: "All Competitions",
  description:
    "Every live PWR competition, filterable by category, drawn transparently when it closes.",
};

export default async function CompetitionsPage() {
  const [live, myEntries] = await Promise.all([
    getLiveCompetitions(),
    getMyEntryMap(),
  ]);
  const featured = live.map((c) => toFeaturedCompetition(c, myEntries.has(c.id)));

  // Soonest-closing live competition drives the hero countdown.
  const nextClose = featured.reduce<string | null>((soonest, c) => {
    if (!soonest) return c.closesAt;
    return new Date(c.closesAt) < new Date(soonest) ? c.closesAt : soonest;
  }, null);

  const free = featured.filter((c) => c.tags?.includes("free"));
  const gold = featured.filter((c) => c.tags?.includes("gold"));

  return (
    // min-h-screen so the black background covers the full page even when
    // there are few competitions. Pulled up with negative margin to sit
    // behind the fixed transparent navbar (see app/(marketing)/layout.tsx's
    // pt-18/20/24 navbar spacer) — the navbar stays transparent over it via
    // navbar.tsx's hasHero check.
    <div className="min-h-screen bg-[#0D0C0C] -mt-18 pt-32 sm:-mt-20 sm:pt-36 lg:-mt-24 lg:pt-40">
      {nextClose && <CompetitionsHero closesAt={nextClose} />}
      <CompetitionsCatalog free={free} gold={gold} />
    </div>
  );
}