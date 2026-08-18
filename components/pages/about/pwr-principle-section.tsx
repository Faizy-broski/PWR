import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";

export interface Principle {
  title: string;
  description: string;
}

const defaultPrinciples: Principle[] = [
  {
    title: "Every Entry Creates Impact.",
    description:
      "Each entry adds to a pool that funds prizes, community work and long-term support beyond the competition.",
  },
  {
    title: "Every Winner Changes Lives.",
    description:
      "A win rarely stops with one person. It reaches families, friends and the people around them.",
  },
  {
    title: "Every Success Creates Opportunity.",
    description:
      "The bigger our community becomes, the more we can invest back into people who need a first chance.",
  },
];

export function PwrPrincipleSection({
  eyebrow = "The PWR Principle",
  titleTop = "Winning With",
  titleAccent = "Purpose",
  principles = defaultPrinciples,
}: {
  eyebrow?: string;
  titleTop?: string;
  titleAccent?: string;
  principles?: Principle[];
}) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <Reveal direction="down" distance={12} duration={0.5}>
          <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-brand-gold-dark uppercase">
            — {eyebrow}
          </p>
        </Reveal>

        <h2 className="text-3xl leading-[1.1] font-extrabold text-[#0D0C0C] uppercase sm:text-4xl lg:text-5xl">
          <TextReveal text={titleTop} delay={0.1} className="block" />
          <TextReveal text={titleAccent} delay={0.3} className="block font-script" />
        </h2>

        <RevealGroup className="mt-10 border-t border-black/10 sm:mt-12">
          {principles.map((principle, i) => (
            <RevealItem key={principle.title}>
              <div className="grid grid-cols-1 gap-3 border-b border-black/10 py-8 sm:grid-cols-[3rem_1fr_1fr] sm:items-start sm:gap-8">
                <span className="text-sm font-bold text-brand-gold-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="max-w-xs text-xl leading-tight font-extrabold text-[#0D0C0C] uppercase sm:text-2xl">
                  {principle.title}
                </p>
                <p className="max-w-md text-sm leading-relaxed text-black/50">
                  {principle.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
