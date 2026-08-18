"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { StatsRow, defaultBrandStats, type StatItem } from "@/components/landing/stats-row";

export function AboutHero({
  eyebrow = "About Us",
  titleTop = "Where Winning",
  titleBottom = "Changes",
  titleAccent = "Lives.",
  stats = defaultBrandStats,
}: {
  eyebrow?: string;
  titleTop?: string;
  titleBottom?: string;
  titleAccent?: string;
  stats?: StatItem[];
}) {
  return (
    <div className="container">
      <div className="text-center">
        <Reveal duration={0.5}>
          <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-brand-gradient uppercase">
            {eyebrow}
          </p>
        </Reveal>

        <h1 className="text-4xl leading-[1.1] font-extrabold text-white uppercase sm:text-5xl lg:text-6xl">
          <TextReveal text={titleTop} delay={0.1} className="block" />
          <span className="block">
            <TextReveal text={titleBottom} delay={0.3} wordClassName="mr-3" />
            <motion.span
              className="font-script inline-block"
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{
                duration: 0.6,
                delay: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {titleAccent}
            </motion.span>
          </span>
        </h1>

        <StatsRow stats={stats} className="mt-8" />
      </div>
    </div>
  );
}
