import Image from "next/image";
import { Car } from "lucide-react";
import { Countdown } from "@/components/landing/competitions/countdown";
import { Reveal } from "@/components/motion/reveal";

export interface CompetitionsHeroStep {
  label: string;
}

const defaultSteps: CompetitionsHeroStep[] = [
  { label: "Select Your Prize" },
  { label: "Play The Game" },
  { label: "Win Your Dream Car" },
];

export function CompetitionsHero({
  eyebrow = "Dream Car Competition",
  category = "Cars",
  closesAt,
  steps = defaultSteps,
}: {
  eyebrow?: string;
  category?: string;
  closesAt: string;
  steps?: CompetitionsHeroStep[];
}) {
  return (
    <div className="container bg-black">
      <Reveal duration={0.5}>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-[11px] font-semibold tracking-wide text-white/60 uppercase">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <span className="flex size-5 items-center justify-center rounded-full border border-brand-gold-dark/60 text-[10px] text-brand-gold-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step.label}
                {i === steps.length - 1 ? (
                  <Car className="size-3.5 text-brand-gold-light" />
                ) : null}
              </span>
              {i < steps.length - 1 ? (
                <span className="text-white/25">→</span>
              ) : null}
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 text-center sm:mt-10">
        <Reveal delay={0.1} direction="down" distance={12} duration={0.5}>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
            — {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <h1 className="text-4xl leading-[1.05] font-extrabold text-white uppercase sm:text-5xl">
            All <span className="font-script">{category}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
              Ends In
            </span>
            <Countdown closesAt={closesAt} variant="cards-light" />
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.4}>
        <div className="relative mt-10 aspect-1309/294 w-full overflow-hidden rounded-2xl sm:mt-12">
          <Image
            src="/competitions-assets/competitions-hero.png"
            alt="Win a Fiat Ducato BEV Serie 2 electric van, plus a bonus La Marzocco espresso machine"
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
