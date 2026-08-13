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

const page = () => {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedCompetitions />
      <HeadlineCompetition />
      <ExploreCompetitions />
      <WhyUs />
      <HowItWorks />
      <Winners />
      <WinnersTicker winners={winners} />
      <PlayWithConfidence />
    </>
  );
};

export default page;
