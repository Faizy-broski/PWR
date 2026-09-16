import Link from "next/link";
import { Gem, Plane, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const tiers = [
  {
    slug: "pwr-diamond",
    icon: Plane,
    eyebrow: "PWR Diamond",
    title: "Win A 2-Night Holiday For Two",
    description:
      "One paid entry anywhere unlocks your free spot. 250 entrants, one free entry each.",
    cta: "Unlock Your Spot",
  },
  {
    slug: "pwr-black-diamond",
    icon: Gem,
    eyebrow: "PWR Black Diamond",
    title: "Guaranteed Win — Tech Bundle",
    description:
      "Unlock with one paid entry and you're guaranteed EarPods, a MacBook and a Powerbank.",
    cta: "Unlock Your Spot",
  },
];

export function DiamondTiers() {
  return (
    <section className="bg-[#0B0B0B] py-16 sm:py-20 lg:py-24">
      <div className="container">
        <Reveal direction="down" distance={12} duration={0.5}>
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
            — Free To Unlock
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
              <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-8 transition-colors hover:border-white/20 sm:p-10">
                <div className="flex size-14 items-center justify-center rounded-full bg-brand-gradient">
                  <tier.icon className="size-6 text-white" />
                </div>

                <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-brand-gradient uppercase">
                  {tier.eyebrow}
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-white uppercase sm:text-2xl">
                  {tier.title}
                </h3>
                <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-white/50">
                  {tier.description}
                </p>

                <Magnetic strength={0.25} className="mt-8 block w-full sm:w-auto">
                  <Button
                    variant="gradient"
                    nativeButton={false}
                    render={<Link href={`/${tier.slug}`} />}
                    className="h-12 w-full rounded-full px-8 text-xs font-bold tracking-widest uppercase sm:w-auto"
                  >
                    {tier.cta}
                    <ArrowRight className="size-4" />
                  </Button>
                </Magnetic>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
