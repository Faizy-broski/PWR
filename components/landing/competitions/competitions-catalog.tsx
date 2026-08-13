"use client";

import { useMemo, useState } from "react";
import { CompetitionListingCard } from "@/components/landing/competitions/competition-listing-card";
import { FilterPills, type FilterPillOption } from "@/components/landing/competitions/filter-pills";
import { CompetitionsHero } from "@/components/landing/competitions/competitions-hero";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { carCompetitions } from "@/lib/data/car-competitions";

const TIERS: FilterPillOption[] = [
  { label: "PWR Free", value: "free" },
  { label: "PWR Gold", value: "gold" },
  { label: "PWR Platinum", value: "platinum" },
  { label: "PWR VIP", value: "vip" },
];

const PAGE_SIZE = 16;

export function CompetitionsCatalog() {
  const [tier, setTier] = useState("free");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const nextClose = useMemo(
    () =>
      carCompetitions.reduce((soonest, c) =>
        new Date(c.closesAt) < new Date(soonest.closesAt) ? c : soonest
      ).closesAt,
    []
  );

  const visible = carCompetitions.slice(0, visibleCount);
  const hasMore = visibleCount < carCompetitions.length;

  return (
    <div className="bg-[#0D0C0C] pt-32 pb-4 sm:pt-36 lg:pt-40">
      <CompetitionsHero closesAt={nextClose} />

      <div className="container">
        <Reveal delay={0.3}>
          <div className="mt-12 sm:mt-14">
            <FilterPills
              variant="segmented"
              options={TIERS}
              value={tier}
              onChange={setTier}
            />
          </div>
        </Reveal>

        <div className="mt-10 flex items-center justify-between sm:mt-12">
          <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">
            {carCompetitions.length} Competitions
          </span>
        </div>

        {visible.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((competition) => (
              <CompetitionListingCard
                key={competition.slug}
                competition={competition}
              />
            ))}
          </div>
        ) : (
          <p className="mt-14 text-center text-sm text-white/50">
            No competitions match that filter yet — check back soon.
          </p>
        )}

        {hasMore ? (
          <div className="mt-12 flex justify-center pb-4">
            <Button
              variant="gradient"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="h-11 rounded-full px-8 text-xs font-bold tracking-widest uppercase"
            >
              Load More Cars
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
