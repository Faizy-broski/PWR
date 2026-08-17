"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { WinnersFilterBar } from "./winners-filter-bar";
import { WinnersGrid } from "./winners-grid";
import type { Winner } from "./winners-card";

const categories = ["All Winners", "Cars", "Cash", "Homes", "Lifestyle", "Experiences"];

function parsePrizeValue(value: string) {
  const match = value.replace(/,/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export function WinnersSection({ winners }: { winners: Winner[] }) {
  const [activeCategory, setActiveCategory] = useState("All Winners");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const filtered = useMemo(() => {
    let result = winners;

    if (activeCategory !== "All Winners") {
      result = result.filter(
        (winner) => winner.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (winner) =>
          winner.name.toLowerCase().includes(q) ||
          winner.location.toLowerCase().includes(q) ||
          winner.prizeName.toLowerCase().includes(q)
      );
    }

    if (sort === "highest-value") {
      result = [...result].sort(
        (a, b) => parsePrizeValue(b.prizeValue) - parsePrizeValue(a.prizeValue)
      );
    } else if (sort === "az") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    // "latest" relies on `winners` already being latest-first from the source

    return result;
  }, [winners, activeCategory, search, sort]);

  return (
    <section className="py-16 sm:py-20">
      <div className="container">
        <Reveal duration={0.5}>
          <WinnersFilterBar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
          />
        </Reveal>

        <div className="mt-8">
          <WinnersGrid winners={filtered} />
        </div>
      </div>
    </section>
  );
}