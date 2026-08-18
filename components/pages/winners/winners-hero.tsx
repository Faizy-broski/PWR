"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { Parallax } from "@/components/motion/parallax";

interface WinnersStatItem {
    icon: string;
    value: string;
    label: string;
}

const defaultStats: WinnersStatItem[] = [
    { icon: "/svg's/trophy.svg", value: "Over 833k+", label: "Winners" },
    { icon: "/svg's/star.svg", value: "26 Years", label: "UK's No.1" },
    { icon: "/svg's/gift.svg", value: "£166M+", label: "In Prize Won" },
];

export function WinnersHero({
    eyebrow = "Meet Our Winners",
    titleTop = "Where Winners",
    titleBottom = "Changing All",
    titleAccent = "Lifes",
    stats = defaultStats,
    bannerSrc = "/winners/winner-hero.png",
    bannerAlt = "PWR — Where Winning Changes Lives. Win big with PWR: cars, watches, cash and more.",
}: {
    eyebrow?: string;
    titleTop?: string;
    titleBottom?: string;
    titleAccent?: string;
    stats?: WinnersStatItem[];
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

                <RevealGroup className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10">
                    {stats.map(({ icon, value, label }, i) => (
                        <RevealItem key={label} className="flex items-center gap-8 sm:gap-10">
                            <div className="flex items-center gap-8 sm:gap-10">
                                {i > 0 ? (
                                    <span
                                        aria-hidden
                                        className="hidden h-8 w-px bg-white/10 sm:block"
                                    />
                                ) : null}
                                <div className="flex items-center gap-2.5">
                                    <img src={icon} alt="" className="size-8" />

                                    <span className="flex flex-col items-start leading-tight">
                                        <span className="text-sm text-white sm:text-[16px]">
                                            {value}
                                        </span>
                                        <span className="text-[11px] font-medium tracking-wide text-white uppercase">
                                            {label}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </RevealItem>
                    ))}
                </RevealGroup>
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
