"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { Parallax } from "@/components/motion/parallax";
import { StatsRow, defaultBrandStats, type StatItem } from "@/components/landing/stats-row";

export function WinnersHero({
    eyebrow = "Meet Our Winners",
    titleTop = "Where Winners",
    titleBottom = "Changing All",
    titleAccent = "Lifes",
    stats = defaultBrandStats,
    bannerSrc = "/winners/winner-hero.png",
    bannerAlt = "PWR — Where Winning Changes Lives. Win big with PWR: cars, watches, cash and more.",
}: {
    eyebrow?: string;
    titleTop?: string;
    titleBottom?: string;
    titleAccent?: string;
    stats?: StatItem[];
    bannerSrc?: string;
    bannerAlt?: string;
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
                        <TextReveal
                            text={titleBottom}
                            delay={0.3}
                            wordClassName="mr-3"
                        />
                        <motion.span
                            className="font-script inline-block "
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

            <Reveal delay={0.3}>
                <Parallax
                    className="mt-10 aspect-1309/430 w-full rounded-2xl sm:mt-12"
                    speed={0.12}
                    scale={1.08}
                >
                    <Image
                        src={bannerSrc}
                        alt={bannerAlt}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                </Parallax>
            </Reveal>
        </div>
    );
}
