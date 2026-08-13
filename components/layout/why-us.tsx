import { Lock, Scale, ShieldCheck, Trophy, type LucideIcon } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export interface WhyUsFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const defaultFeatures: WhyUsFeature[] = [
  {
    icon: Trophy,
    title: "Real Prizes",
    description:
      "Every prize is bought and owned before the competition opens. No sourcing after the draw.",
  },
  {
    icon: Scale,
    title: "Fair Competitions",
    description:
      "A skill question, a published entry cap and a randomly generated winning number. Every time.",
  },
  {
    icon: Lock,
    title: "Secure Entry",
    description:
      "Encrypted payments, 3D Secure and no card details stored on our servers.",
  },
  {
    icon: ShieldCheck,
    title: "Real Winners",
    description:
      "Draws are recorded, winners are named and prizes are handed over on camera.",
  },
];

export function WhyUs({
  features = defaultFeatures,
}: {
  features?: WhyUsFeature[];
}) {
  return (
    <section className="container py-16 sm:py-20 lg:py-24">
      <Reveal direction="down" distance={12} duration={0.5}>
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-brand-gold-dark uppercase">
          — Why Us
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="text-4xl leading-[1.05] font-extrabold uppercase sm:text-5xl">
          Why Play <span className="font-script">With</span> PWR?
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
          Four commitments that sit behind every single competition we run.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <RevealItem
            key={feature.title}
            className="relative bg-background p-6 sm:p-7"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute top-4 right-5 text-5xl font-extrabold text-muted select-none sm:text-6xl"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <feature.icon className="relative size-6 text-brand-gold-dark" strokeWidth={1.75} />

            <h3 className="relative mt-6 text-sm font-bold tracking-wide uppercase">
              {feature.title}
            </h3>
            <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
