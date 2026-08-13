"use client";

import { useMemo, useState } from "react";
import { CompetitionListingCard } from "@/components/landing/competitions/competition-listing-card";
import { FilterPills, type FilterPillOption } from "@/components/landing/competitions/filter-pills";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { FeaturedCompetition } from "@/components/landing/competitions/featured-competition-card";

const TIERS: FilterPillOption[] = [
  { label: "All", value: "all" },
  { label: "PWR Free", value: "free" },
  { label: "PWR Gold", value: "gold" },
  { label: "PWR Platinum", value: "platinum" },
  { label: "PWR VIP", value: "vip" },
];

const PAGE_SIZE = 16;

export function CompetitionsCatalog({
  live,
}: {
  live: FeaturedCompetition[];
}) {
  const [tier, setTier] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredLive = useMemo(
    () =>
      tier === "all" ? live : live.filter((c) => c.tags?.includes(tier)),
    [live, tier],
  );

  const visible = filteredLive.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLive.length;

  return (
    <div className="pb-4">
      <div className="container">
        <Reveal delay={0.3}>
          <div className="mt-12 sm:mt-14">
            <FilterPills
              variant="segmented"
              options={TIERS}
              value={tier}
              onChange={(v) => {
                setTier(v);
                setVisibleCount(PAGE_SIZE);
              }}
            />
          </div>
        </Reveal>

        <div className="mt-10 flex items-center justify-between sm:mt-12">
          <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">
            {filteredLive.length} Live Competitions
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
              Load More
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
