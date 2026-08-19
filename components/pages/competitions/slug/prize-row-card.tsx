"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { FeaturedCompetition } from "@/components/pages/competitions/featured-competition-card";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

// A compact horizontal row card for the "Prizes you can win" grid on the
// competition detail page — distinct from the vertical CompetitionListingCard
// used on the main /competitions listing, which needs the larger CTA button
// treatment that would be too heavy repeated six-up in a dense grid here.
export function PrizeRowCard({
  competition,
}: {
  competition: FeaturedCompetition;
}) {
  const { slug, title, image, prizeValue } = competition;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/competitions/${slug}`}
        className="group flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
          <Image
            src={image}
            alt={title}
            fill
            unoptimized
            sizes="56px"
            className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-extrabold text-neutral-900 uppercase">
            {title}
          </h3>
          <p className="truncate text-xs text-neutral-500">
            Worth {formatGBP(prizeValue)}
          </p>
        </div>

        <span className="shrink-0 text-sm font-extrabold tracking-wide text-brand-gold-dark uppercase">
          Free
        </span>
      </Link>
    </motion.div>
  );
}
