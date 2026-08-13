import { FileCheck, Lock, ShieldCheck, Scale, type LucideIcon } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export interface ConfidencePoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

const defaultPoints: ConfidencePoint[] = [
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Encrypted checkout with 3D Secure on every transaction.",
  },
  {
    icon: Scale,
    title: "Fair Competitions",
    description: "Independently audited random draws, every single time.",
  },
  {
    icon: FileCheck,
    title: "Transparent Rules",
    description: "Entry caps, odds and closing dates published up front.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Winners",
    description: "Every winner named, filmed and published within 48 hours.",
  },
];

export function PlayWithConfidence({
  points = defaultPoints,
}: {
  points?: ConfidencePoint[];
}) {
  return (
    <section className="container py-16 sm:py-20 lg:py-24">
      <Reveal direction="down" distance={12} duration={0.5}>
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-brand-gold-dark uppercase">
          — Transparency
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="text-4xl leading-[1.05] font-extrabold uppercase sm:text-5xl">
          Play With
          <br />
          <span className="font-script text-4xl sm:text-5xl">
            Confidence
          </span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
          Competitions should be exciting — never uncertain.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid grid-cols-1 divide-y divide-border border-t border-border sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 lg:divide-x">
        {points.map((point) => (
          <RevealItem key={point.title} className="py-6 sm:px-6 sm:py-8">
            <point.icon
              className="size-5 text-brand-gold-dark"
              strokeWidth={1.75}
            />
            <h3 className="mt-4 text-sm font-bold tracking-wide uppercase">
              {point.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {point.description}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
