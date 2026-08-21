import { Hero } from "@/components/layout/hero";
import { CategoryStrip } from "@/components/landing/competitions/category-strip";
import { FeaturedCompetitions } from "@/components/layout/featured-competitions";
import { HeadlineCompetition } from "@/components/layout/headline-competition";
import { ExploreCompetitions } from "@/components/layout/explore-competitions";
import { WhyUs } from "@/components/layout/why-us";
import { HowItWorks } from "@/components/layout/how-it-works";
import { Winners } from "@/components/layout/winners";
import { WinnersTicker } from "@/components/landing/winners/winners-ticker";
import { winners } from "@/lib/data/winners";
import { PlayWithConfidence } from "@/components/layout/play-with-confidence";
import {
  getLiveCompetitions,
  toFeaturedCompetition,
} from "@/lib/data/competitions";
import { getMyEntryMap } from "@/lib/data/entries";

const page = async () => {
  const [live, myEntries] = await Promise.all([
    getLiveCompetitions(),
    getMyEntryMap(),
  ]);
  const featured = live.map((c) => toFeaturedCompetition(c, myEntries.has(c.id)));

  // Highest prize value drives the headline section.
  const headline = live.reduce<(typeof live)[number] | null>((best, c) => {
    if (!best) return c;
    return c.prizeValue > best.prizeValue ? c : best;
  }, null);

  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedCompetitions competitions={featured} />
      {headline && (
        <HeadlineCompetition
          competition={{
            slug: headline.slug,
            image: headline.images[0],
            title: headline.title,
            description: headline.description,
            prizeValue: headline.prizeValue,
            ticketPrice: headline.ticketPrice,
            closesAt: headline.closesAt,
          }}
        />
      )}
      <ExploreCompetitions competitions={featured} />
      <WhyUs />
      <HowItWorks />
      <Winners />
      <WinnersTicker winners={winners} />
      <PlayWithConfidence />
    </>
  );
};

export default page;
