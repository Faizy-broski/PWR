import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";

export interface HowItWorksStep {
  title: string;
  description: string;
}

const defaultSteps: HowItWorksStep[] = [
  {
    title: "Choose Your Competition",
    description:
      "Browse cars, cash, tech and experiences. Every entry price and draw date is on the card.",
  },
  {
    title: "Answer the Question & Enter",
    description:
      "One quick skill question, secure checkout, instant email confirmation with your entry numbers.",
  },
  {
    title: "Watch the Draw & Win",
    description:
      "Draws are streamed live and recorded. Winners are contacted within the hour.",
  },
];

export function HowItWorks({
  steps = defaultSteps,
}: {
  steps?: HowItWorksStep[];
}) {
  return (
    <section id="how-it-works" className="relative isolate overflow-hidden bg-black py-20 sm:py-24 lg:py-28">
      <Image
        src="/how-it-works.png"
        alt="Winners posing with their prize Porsche"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/70" />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal direction="down" distance={12} duration={0.5}>
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
              — How It Works
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="flex flex-wrap items-baseline justify-center gap-x-3 text-3xl font-extrabold text-white uppercase sm:text-4xl lg:text-5xl">
              <span>Winning</span>
              <span className="text-4xl font-script sm:text-5xl lg:text-6xl">
                Starts
              </span>
              <span>Here</span>
            </h2>
          </Reveal>
        </div>

        <div className="relative mx-auto mt-16  sm:mt-20">
          <div className="absolute top-6 left-[16.6667%] right-[16.6667%] hidden h-px bg-brand-gold-dark/40 sm:block" />

          <RevealGroup className="relative grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
            {steps.map((step, i) => (
              <RevealItem
                key={step.title}
                className="flex flex-col items-center text-center"
              >
                <span className="mb-4 flex size-12 shrink-0 items-center justify-center rounded-full border border-brand-gold-dark/60 bg-black text-sm font-bold text-brand-gold-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-bold tracking-wide text-white uppercase">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                  {step.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal delay={0.3}>
          <div className="mt-14 flex justify-center sm:mt-16">
            <Magnetic strength={0.3}>
              <Button
                variant="gradient"
                nativeButton={false}
                render={<Link href="/competitions" />}
                className="h-12 rounded-full px-10 text-xs font-bold tracking-widest uppercase"
              >
                Explore Competitions
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
