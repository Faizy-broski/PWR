import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CompetitionListingCard } from "@/components/landing/competitions/competition-listing-card";
import { ComingSoonBanner } from "@/components/pages/competitions/coming-soon-banner";
import { Reveal } from "@/components/motion/reveal";
import type { FeaturedCompetition } from "@/components/pages/competitions/featured-competition-card";

export function TierSection({
  id,
  title,
  description,
  viewAllHref,
  competitions,
  comingSoon = false,
}: {
  id: string;
  title: string;
  description: string;
  viewAllHref: string;
  competitions?: FeaturedCompetition[];
  comingSoon?: boolean;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <Reveal duration={0.5}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-widest text-brand-gold-light uppercase">
              {title}
            </h2>
            <p className="mt-1 text-xs text-white/40">{description}</p>
          </div>

          {!comingSoon ? (
            <Link
              href={viewAllHref}
              className="group flex shrink-0 items-center gap-1.5 text-xs border border-white/70 p-3 rounded-full font-bold tracking-wide text-white/60 uppercase transition-colors hover:text-white"
            >
              View All
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>
      </Reveal>

      {comingSoon ? (
        <Reveal delay={0.1}>
          <ComingSoonBanner />
        </Reveal>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {competitions?.map((competition, i) => (
            <Reveal key={competition.slug} delay={0.05 * i}>
              <CompetitionListingCard competition={competition} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}