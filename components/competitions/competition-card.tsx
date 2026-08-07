"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Competition } from "@/lib/types";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function CompetitionCard({ competition }: { competition: Competition }) {
  const percentSold = Math.min(
    100,
    Math.round((competition.ticketsSold / competition.totalTickets) * 100),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/competitions/${competition.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={competition.images[0]}
            alt={competition.title}
            fill
            className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
          />
          <Badge
            className="absolute left-3 top-3"
            variant={competition.status === "live" ? "default" : "secondary"}
          >
            {competition.status === "live" ? "Live" : "Closed"}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="font-semibold leading-snug">{competition.title}</h3>
          <p className="text-sm text-muted-foreground">
            Cash alternative available
          </p>

          <div className="mt-auto space-y-2">
            <Progress value={percentSold} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{percentSold}% sold</span>
              <span>{formatGBP(competition.prizeValue)} prize</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="text-lg font-semibold">
              {formatGBP(competition.ticketPrice)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
