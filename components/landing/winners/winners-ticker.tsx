"use client";

import { Sparkle } from "lucide-react";
import { motion } from "motion/react";
import type { Winner } from "@/lib/data/winners";

export function WinnersTicker({
  winners,
  label = "Recent Winners",
  speed = 40,
}: {
  winners: Winner[];
  label?: string;
  speed?: number;
}) {
  const items = [...winners, ...winners];
  const duration = winners.length * (60 / speed) * 4;

  return (
    <section className="flex items-center gap-6 overflow-hidden bg-black py-4">
      <span className="ml-6 shrink-0 text-xs font-bold tracking-[0.2em] text-brand-gold-light uppercase">
        {label}
      </span>

      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <motion.div
          className="flex w-max items-center gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        >
          {items.map((winner, i) => (
            <div
              key={`${winner.name}-${winner.location}-${i}`}
              className="flex shrink-0 items-center gap-2.5 text-sm whitespace-nowrap text-white"
            >
              <Sparkle className="size-3.5 shrink-0 text-brand-gold-light" />
              <span className="font-bold">{winner.name}</span>
              <span className="text-white/40">—</span>
              <span className="text-white/70">{winner.prizeLabel}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
