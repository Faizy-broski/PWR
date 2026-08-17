import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { FeaturedCompetitionCard } from "@/components/landing/competitions/featured-competition-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { showcaseCompetitions } from "@/lib/data/showcase-competitions";

const featuredCompetitions = showcaseCompetitions.slice(0, 3);

export function FeaturedCompetitions() {
  return (
    <section className="container py-16 sm:py-20 lg:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
        <div>
          <Reveal direction="down" distance={12} duration={0.5}>
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-brand-gold-dark uppercase">
              — Featured
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl uppercase">
              Featured
              <br />
              <span className="font-script">Competitions</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
              Your next win could be closer than you think.
            </p>
          </Reveal>
        </div>

        <Reveal direction="left" distance={16} delay={0.2}>
          <Link
            href="/competitions"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 gap-2 rounded-full border-foreground px-5 text-xs font-bold tracking-widest uppercase hover:bg-foreground hover:text-background"
            )}
          >
            View All
            <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredCompetitions.map((competition) => (
          <FeaturedCompetitionCard
            key={competition.slug}
            competition={competition}
          />
        ))}
      </div>
    </section>
  );
}
