"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import {
  FeaturedCompetitionCard,
  type FeaturedCompetition,
} from "@/components/pages/competitions/featured-competition-card";
import {
  FilterPills,
  type FilterPillOption,
} from "@/components/landing/competitions/filter-pills";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FILTERS: FilterPillOption[] = [
  { label: "All", value: "all" },
  { label: "Cars", value: "cars" },
  { label: "Cash", value: "cash" },
  { label: "Tech", value: "tech" },
  { label: "Lifestyle", value: "lifestyle" },
  { label: "Experiences", value: "experiences" },
  { label: "Instant Wins", value: "instant-win" },
  { label: "Ending Soon", value: "ending-soon" },
];

const SORTS = [
  { label: "Featured", value: "featured" },
  { label: "Ending Soon", value: "ending-soon" },
  { label: "Most Entered", value: "most-entered" },
  { label: "Price: Low to High", value: "price-asc" },
] as const;

const PAGE_SIZE = 6;

export function ExploreCompetitions({
  competitions,
}: {
  competitions: FeaturedCompetition[];
}) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["value"]>("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const list =
      filter === "all"
        ? competitions
        : competitions.filter((c) => c.tags?.includes(filter));

    const sorted = [...list];
    if (sort === "ending-soon") {
      sorted.sort(
        (a, b) => new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime()
      );
    } else if (sort === "most-entered") {
      sorted.sort((a, b) => b.percentEntered - a.percentEntered);
    } else if (sort === "price-asc") {
      sorted.sort((a, b) => a.ticketPrice - b.ticketPrice);
    }

    return sorted;
  }, [competitions, filter, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section className="container py-16 sm:py-20 lg:py-24">
      <Reveal direction="down" distance={12} duration={0.5}>
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-brand-gold-dark uppercase">
          — Discovery
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="text-4xl leading-[1.05] font-extrabold uppercase sm:text-5xl">
          Explore All
          <br />
          <span className="font-script text-4xl sm:text-5xl">
            Competitions
          </span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
          Filter by what you actually want to win.
        </p>
      </Reveal>

      <div className="mt-10 flex flex-col gap-4 border-y border-border py-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
        <FilterPills
          options={FILTERS}
          value={filter}
          onChange={(next) => {
            setFilter(next);
            setVisibleCount(PAGE_SIZE);
          }}
        />

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Sort
          </span>
          <Select
            value={sort}
            onValueChange={(next) => setSort(next as typeof sort)}
          >
            <SelectTrigger size="sm" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((competition) => (
            <FeaturedCompetitionCard
              key={competition.slug}
              competition={competition}
            />
          ))}
        </div>
      ) : (
        <p className="mt-14 text-center text-sm text-muted-foreground">
          No competitions match that filter yet — check back soon.
        </p>
      )}

      {hasMore ? (
        <div className="mt-12 flex justify-center">
          <Button
            variant="gradient"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="h-11 rounded-full px-8 text-xs font-bold tracking-widest uppercase"
          >
            Load More Competitions
          </Button>
        </div>
      ) : null}
    </section>
  );
}
