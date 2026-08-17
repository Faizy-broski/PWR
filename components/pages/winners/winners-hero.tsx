import Image from "next/image";
import { Trophy, Star, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

interface WinnersStatItem {
    icon: LucideIcon;
    value: string;
    label: string;
}

const defaultStats: WinnersStatItem[] = [
    { icon: Trophy, value: "Over 833k+", label: "Winners" },
    { icon: Star, value: "26 Years", label: "UK's No.1" },
    { icon: Gift, value: "£166M+", label: "In Prize Won" },
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
                    <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-brand-gold-light uppercase">
                        {eyebrow}
                    </p>
                </Reveal>

                <Reveal delay={0.1}>
                    <h1 className="text-4xl leading-[1.1] font-extrabold text-white uppercase sm:text-5xl lg:text-6xl">
                        {titleTop}
                        <br />
                        {titleBottom}{" "}
                        <span className="font-script">
                            {titleAccent}
                        </span>
                    </h1>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10">
                        {stats.map(({ icon: IconComponent, value, label }, i) => {
                            const Icon = IconComponent;
                            return (
                            <div key={label} className="flex items-center gap-8 sm:gap-10">
                                {i > 0 ? (
                                    <span
                                        aria-hidden
                                        className="hidden h-8 w-px bg-white/10 sm:block"
                                    />
                                ) : null}
                                <div className="flex items-center gap-2.5">

                                    <Icon className="size-8" />

                                    <span className="flex flex-col items-start leading-tight">
                                        <span className="text-sm  text-white sm:text-[16px]">
                                            {value}
                                        </span>
                                        <span className="text-[11px] font-medium tracking-wide text-white uppercase">
                                            {label}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        );
                        })}
                    </div>
                </Reveal>
            </div>

            <Reveal delay={0.3}>
                <div className="relative mt-10 aspect-[1309/430] w-full overflow-hidden rounded-2xl sm:mt-12">
                    <Image
                        src={bannerSrc}
                        alt={bannerAlt}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                </div>
            </Reveal>
        </div>
    );
}