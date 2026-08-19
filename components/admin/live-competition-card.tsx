"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Competition } from "@/lib/types";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function LiveCompetitionCard({
  competition,
}: {
  competition: Competition;
}) {
  const percentSold = Math.min(
    100,
    Math.round((competition.ticketsSold / competition.totalTickets) * 100),
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full bg-muted">
        <Image
          src={competition.images[0]}
          alt=""
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-semibold">{competition.title}</h3>

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Entry</p>
            <p className="font-semibold text-brand-gold-dark">Free</p>
          </div>
          <div>
            <p className="text-muted-foreground">Prize</p>
            <p className="font-semibold">{formatGBP(competition.prizeValue)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ends</p>
            <p className="font-semibold">
              {new Date(competition.closesAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>

        <Progress value={percentSold} className="mt-3" />
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {competition.ticketsSold.toLocaleString()} /{" "}
          {competition.totalTickets.toLocaleString()} tickets ({percentSold}%)
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`/admin/competitions/${competition.id}`} />}
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link
                href={`/competitions/${competition.slug}`}
                target="_blank"
              />
            }
          >
            <Eye className="size-3.5" />
            View
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
