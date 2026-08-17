"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { FeaturedCompetition } from "@/components/landing/competitions/featured-competition-card";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatTimeLeft(target: string, expiredLabel: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return expiredLabel;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h`;
}

// Computed after mount only: it depends on Date.now(), which would otherwise
// mismatch between the server-rendered and hydrated markup.
function useTimeLeft(target: string, expiredLabel: string) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(formatTimeLeft(target, expiredLabel));
  }, [target, expiredLabel]);

  return label;
}

export function CompetitionListingCard({
  competition,
  mode = "live",
}: {
  competition: FeaturedCompetition;
  /** "upcoming" shows a "Starts in" countdown and a disabled CTA instead of
   * "Enter Now" — for competitions scheduled ahead of their start time. */
  mode?: "live" | "upcoming";
}) {
  const { slug, title, image, category, prizeValue, ticketPrice, closesAt } =
    competition;
  const isUpcoming = mode === "upcoming";
  const timeLeft = useTimeLeft(
    isUpcoming ? competition.startsAt ?? closesAt : closesAt,
    isUpcoming ? "Starting" : "Closed",
  );

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
            unoptimized
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
          {isUpcoming && (
            <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
              Coming soon
            </span>
          )}
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
            {isUpcoming ? "Starts in" : "Ends in"} {timeLeft ?? "—"}
          </div>
        </div>

        <div className="p-4 pt-3">
          <div
            className={cn(
              "flex items-center justify-center gap-2 rounded-full py-3 text-xs font-bold tracking-widest uppercase transition-colors",
              isUpcoming
                ? "bg-muted text-muted-foreground group-hover:bg-muted"
                : "bg-black text-white group-hover:bg-brand-gradient",
            )}
          >
            {isUpcoming ? "View Details" : "Enter Now"}
            <ArrowRight className="size-3.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}