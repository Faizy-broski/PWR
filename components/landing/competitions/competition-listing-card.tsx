"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import type { FeaturedCompetition } from "@/components/landing/competitions/featured-competition-card";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatTimeLeft(closesAt: string) {
  const diff = new Date(closesAt).getTime() - Date.now();
  if (diff <= 0) return "Closed";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h`;
}

// Computed after mount only: it depends on Date.now(), which would otherwise
// mismatch between the server-rendered and hydrated markup.
function useTimeLeft(closesAt: string) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(formatTimeLeft(closesAt));
  }, [closesAt]);

  return label;
}

export function CompetitionListingCard({
  competition,
}: {
  competition: FeaturedCompetition;
}) {
  const { slug, title, image, category, prizeValue, ticketPrice, closesAt } =
    competition;
  const timeLeft = useTimeLeft(closesAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link
        href={`/competitions/${slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="p-4 pb-0">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {category}
          </span>
        </div>

        <div className="relative aspect-4/3 w-full shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 border-t border-border px-4 pt-3">
          <h3 className="text-sm leading-snug font-extrabold text-foreground uppercase">
            {title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {formatGBP(prizeValue)}{" "}
              <span className="text-[10px] font-normal uppercase">Prize</span>
            </span>
            <span className="text-sm font-bold text-brand-gold-dark">
              {formatGBP(ticketPrice)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Ends in {timeLeft ?? "—"}
          </div>
        </div>

        <div className="p-4 pt-3">
          <div className="flex items-center justify-center gap-2 rounded-full bg-black py-3 text-xs font-bold tracking-widest text-white uppercase transition-colors group-hover:bg-brand-gold-dark">
            Enter Now
            <ArrowRight className="size-3.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}