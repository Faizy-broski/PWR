import Link from "next/link";
import { Gem, Plane, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { FloatingDiamonds } from "@/components/motion/floating-diamonds";
import { HoverLift } from "@/components/motion/hover-lift";

const tiers = [
  {
    slug: "pwr-diamond",
    icon: Plane,
    eyebrow: "PWR Diamond",
    title: "Win A 2-Night Holiday For Two",
    description:
      "One paid entry anywhere unlocks your free spot. 250 entrants, one free entry each.",
    stat: "250",
    statLabel: "Entrants",
    cta: "Unlock Your Spot",
  },
  {
    slug: "pwr-black-diamond",
    icon: Gem,
    eyebrow: "PWR Black Diamond",
    title: "Guaranteed Win — Tech Bundle",
    description:
      "Unlock with one paid entry and you're guaranteed EarPods, a MacBook and a Powerbank.",
    stat: "100%",
    statLabel: "Guaranteed",
    cta: "Unlock Your Spot",
  },
];

export function DiamondTiers() {
  return (
    <section className="relative overflow-hidden bg-[#0B0B0B] py-16 sm:py-20 lg:py-24">
      <FloatingDiamonds />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold-dark/10 blur-[120px]"
        aria-hidden
      />
      <div className="container relative">
        <Reveal direction="down" distance={12} duration={0.5}>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
            <span className="h-px w-6 bg-brand-gradient" />
            Free To Unlock
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-4xl leading-[1.05] font-extrabold text-white uppercase sm:text-5xl">
            The Diamond Tiers
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-4 max-w-md text-sm text-white/60 sm:text-base">
            Purchase one paid entry to any competition and both free spots
            below unlock automatically.
          </p>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6">
          {tiers.map((tier) => (
            <RevealItem key={tier.slug}>
              <HoverLift className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-8 transition-colors duration-300 hover:border-brand-gold-light/40 sm:p-10">
                  <div
                    className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-brand-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                    aria-hidden
                  />

                  <div className="relative flex items-start justify-between">
                    <div className="relative flex size-14 items-center justify-center rounded-full bg-brand-gradient shadow-[0_0_30px_-8px] shadow-brand-gold-dark/70 transition-transform duration-300 group-hover:scale-110">
                      <tier.icon className="size-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-brand-gradient sm:text-3xl">
                        {tier.stat}
                      </p>
                      <p className="text-[10px] font-semibold tracking-[0.15em] text-white/40 uppercase">
                        {tier.statLabel}
                      </p>
                    </div>
                  </div>

                  <p className="relative mt-6 text-xs font-semibold tracking-[0.2em] text-brand-gradient uppercase">
                    {tier.eyebrow}
                  </p>
                  <h3 className="relative mt-2 text-xl font-extrabold text-white uppercase sm:text-2xl">
                    {tier.title}
                  </h3>
                  <p className="relative mt-3 max-w-[36ch] text-sm leading-relaxed text-white/50">
                    {tier.description}
                  </p>

                  <Magnetic strength={0.25} className="relative mt-8 block w-full sm:mt-auto sm:w-auto sm:pt-8">
                    <Button
                      variant="gradient"
                      nativeButton={false}
                      render={<Link href={`/${tier.slug}`} />}
                      className="h-12 w-full rounded-full px-8 text-xs font-bold tracking-widest uppercase shadow-[0_8px_30px_-8px] shadow-brand-gold-dark/60 transition-shadow duration-300 group-hover:shadow-brand-gold-light/40 sm:w-auto"
                    >
                      {tier.cta}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Magnetic>
                </div>
              </HoverLift>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
