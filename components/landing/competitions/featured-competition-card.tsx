"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CompactCountdown } from "@/components/landing/competitions/countdown";
import { cn } from "@/lib/utils";

export type BadgeTone = "gold" | "orange" | "blue";

export interface FeaturedCompetition {
  slug: string;
  title: string;
  image: string;
  category: string;
  badge?: { label: string; tone?: BadgeTone };
  prizeValue: number;
  ticketPrice: number;
  closesAt: string;
  /** Only set for scheduled competitions (see CompetitionListingCard mode="upcoming"). */
  startsAt?: string;
  percentEntered: number;
  ticketsLeft: number;
  /** Whether the signed-in user already holds a ticket for this competition. */
  entered?: boolean;
  /** Facet tags used for filtering (e.g. category slug, "instant-win", "ending-soon"). */
  tags?: string[];
}

const badgeTones: Record<BadgeTone, string> = {
  gold: "bg-brand-gradient text-white",
  orange: "bg-orange-500 text-white",
  blue: "bg-blue-600 text-white",
};

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function FeaturedCompetitionCard({
  competition,
  className,
}: {
  competition: FeaturedCompetition;
  className?: string;
}) {
  const {
    slug,
    title,
    image,
    category,
    badge,
    prizeValue,
    ticketPrice,
    closesAt,
    percentEntered,
    ticketsLeft,
    entered,
  } = competition;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={cn("h-full", className)}
    >
      <Link
        href={`/competitions/${slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl"
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <span className="absolute top-3 left-3 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
            {category}
          </span>

          {entered ? (
            <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow-sm">
              <Check className="size-3" />
              Entered
            </span>
          ) : badge ? (
            <span
              className={cn(
                "absolute top-3 right-3 max-w-[55%] rounded-full px-2.5 py-1 text-right text-[10px] leading-tight font-bold tracking-wide uppercase shadow-sm",
                badgeTones[badge.tone ?? "gold"]
              )}
            >
              {badge.label}
            </span>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/85 to-black/0 px-3 pt-6 pb-2.5 text-white">
            <div className="leading-tight">
              <div className="text-[9px] tracking-wider text-white/70 uppercase">
                Prize value
              </div>
              <div className="text-sm font-bold">{formatGBP(prizeValue)}</div>
            </div>
            <CompactCountdown
              closesAt={closesAt}
              className="text-xs font-semibold tabular-nums text-white/90"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="leading-snug font-bold text-foreground">{title}</h3>

          <div className="mt-auto space-y-1.5">
            <ProgressPrimitive.Root
              value={Math.min(100, percentEntered)}
              className="block"
            >
              <ProgressPrimitive.Track className="relative flex h-1.5 w-full items-center overflow-hidden rounded-full bg-muted">
                <ProgressPrimitive.Indicator className="h-full bg-brand-gradient transition-[width] duration-500" />
              </ProgressPrimitive.Track>
            </ProgressPrimitive.Root>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{percentEntered}% entered</span>
              <span>{ticketsLeft.toLocaleString("en-GB")} left</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="leading-tight">
              <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
                Entry from
              </div>
              <div className="text-lg font-bold">{formatGBP(ticketPrice)}</div>
            </div>
            {entered ? (
              <span className="flex items-center gap-1.5 rounded-full border border-border px-5 py-1.5 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                <Check className="size-3.5" />
                Entered
              </span>
            ) : (
              <span
                className={cn(
                  buttonVariants({ variant: "gradient", size: "sm" }),
                  "rounded-full px-5 text-[11px] font-bold tracking-wide uppercase"
                )}
              >
                Enter Now
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
