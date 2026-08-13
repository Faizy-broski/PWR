import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { WinnerCard } from "@/components/landing/winners/winner-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { winners } from "@/lib/data/winners";

export function Winners() {
  return (
    <section className="container py-16 sm:py-20 lg:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
        <div>
          <Reveal direction="down" distance={12} duration={0.5}>
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-brand-gold-dark uppercase">
              — Winners
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl leading-[1.05] font-extrabold uppercase sm:text-5xl">
              Real People.
              <br />
              <span className="font-script text-4xl sm:text-5xl">
                Real
              </span>{" "}
              Wins.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
              Every winner named, photographed and published.
            </p>
          </Reveal>
        </div>

        <Reveal direction="left" distance={16} delay={0.2}>
          {/* No dedicated "all winners" page exists yet — point at
              competitions in the meantime rather than a dead link. */}
          <Link
            href="/competitions"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 gap-2 rounded-full px-5 text-xs font-bold tracking-widest uppercase"
            )}
          >
            View All Winners
            <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>
      </div>

      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {winners.map((winner, i) => (
          <RevealItem key={`${winner.name}-${winner.location}`}>
            <WinnerCard winner={winner} highlighted={i % 3 === 1} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
