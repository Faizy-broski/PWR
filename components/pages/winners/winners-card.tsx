"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/magnetic";

export interface Winner {
  id: string;
  category: string;
  name: string;
  location: string;
  prizeName: string;
  prizeValue: string;
  image: string;
  imageAlt: string;
  href: string;
}

export function WinnerCard({
  winner,
  className,
}: {
  winner: Winner;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={cn(
        "group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={winner.image}
          alt={winner.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover p-2 rounded-2xl transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-brand-gold-light px-3 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
          {winner.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-sm font-extrabold tracking-wide text-[#0D0C0C] uppercase">
          {winner.name}{" "}
          <span className="font-normal text-black/35">—</span>{" "}
          {winner.location}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="h-px w-4 bg-brand-gold-dark" aria-hidden />
          <span className="text-[11px] font-semibold tracking-[0.15em] text-brand-gold-dark uppercase">
            Won
          </span>
        </div>

        <p className="mt-1.5 text-[15px] font-semibold text-[#0D0C0C]">
          {winner.prizeName}
        </p>
        <p className="text-xs text-black/40">{winner.prizeValue}</p>

        <Magnetic strength={0.25} className="mt-4 inline-block">
          <Link
            href={winner.href}
            className="group/link inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-[#0D0C0C] uppercase transition-colors hover:text-brand-gold-dark"
          >
            View Winner Story
            <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </Magnetic>
      </div>
    </motion.article>
  );
}
