"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Tag, Ticket } from "lucide-react";
import type { FeaturedCompetition } from "@/components/pages/competitions/featured-competition-card";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function TrendingCard({ competition }: { competition: FeaturedCompetition }) {
  const { slug, title, image, category, prizeValue, ticketsLeft } =
    competition;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/competitions/${slug}`}
        className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-neutral-50">
          <Image
            src={image}
            alt={title}
            fill
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <h3 className="mt-4 text-sm font-extrabold text-neutral-900 uppercase">
          {title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Tag className="size-3.5 text-brand-gold-dark" />
            {category}
          </span>
          <span className="flex items-center gap-1">
            <Ticket className="size-3.5 text-brand-gold-dark" />
            {ticketsLeft.toLocaleString()} left
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
          <span className="text-sm font-extrabold text-brand-gold-dark">
            {formatGBP(prizeValue)}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold tracking-wide text-neutral-500 uppercase transition-colors group-hover:text-neutral-900">
            Details
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function TrendingNow({
  competitions,
}: {
  competitions: FeaturedCompetition[];
}) {
  if (competitions.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
        Trending now
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {competitions.map((c) => (
          <TrendingCard key={c.slug} competition={c} />
        ))}
      </div>
    </div>
  );
}
