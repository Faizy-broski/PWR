import type { Metadata } from "next";
import { AboutHero } from "@/components/pages/about/about-hero";
import { OurStorySection } from "@/components/pages/about/our-story-section";
import { PwrPrincipleSection } from "@/components/pages/about/pwr-principle-section";
import { CommunitySection } from "@/components/pages/about/community-section";
import { ValuesSection } from "@/components/pages/about/values-section";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "PWR was built around a simple belief — winning should mean more than taking home a prize.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0C0C] -mt-18 pt-32 sm:-mt-20 sm:pt-36 lg:-mt-24 lg:pt-40">
      <AboutHero />
      <OurStorySection />
      <PwrPrincipleSection />
      <CommunitySection />
      <ValuesSection />
    </div>
  );
}
