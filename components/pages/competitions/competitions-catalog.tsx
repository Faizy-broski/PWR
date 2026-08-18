import { Gift, Star, Crown, Gem } from "lucide-react";
import { TierPillCard, type TierPillData } from "@/components/pages/competitions/tier-pill-cards";
import { TierSection } from "@/components/pages/competitions/tier-section";
import { Reveal } from "@/components/motion/reveal";
import type { FeaturedCompetition } from "@/components/pages/competitions/featured-competition-card";

const tierPills: TierPillData[] = [
  { id: "pwr-free", label: "PWR Free", description: "Free competitions for everyone", icon: "/svg's/gift.svg", status: "live" },
  { id: "pwr-gold", label: "PWR Gold", description: "Our main paid Competition", icon: "/svg's/star.svg", status: "live" },
  { id: "pwr-platinum", label: "PWR Platinum", description: "Higher value competition", icon: "/svg's/silver-crown.svg", status: "comingSoon" },
  { id: "pwr-vip", label: "PWR VIP", description: "Top end, exclusive competition", icon: "/svg's/gold-crown.svg", status: "comingSoon" },
];

export function CompetitionsCatalog({
  free,
  gold,
}: {
  free: FeaturedCompetition[];
  gold: FeaturedCompetition[];
}) {
  return (
    <div className="pb-4">
      <div className="container px-4 sm:px-6 lg:px-8">
        <Reveal duration={0.5}>
          <div className="grid grid-cols-1 gap-2 xs:gap-3 sm:mt-6 sm:gap-4 md:grid-cols-4 md:gap-4">
            {tierPills.map((tier) => (
              <TierPillCard key={tier.id} tier={tier} />
            ))}
          </div>
        </Reveal>

        <div className="mt-10 space-y-10 sm:mt-14 sm:space-y-14 lg:mt-16 lg:space-y-16">
          <TierSection
            id="pwr-free"
            title="PWR Free"
            description="Free competitions — no payment needed."
            viewAllHref="/competitions?tier=free"
            competitions={free}
          />

          <TierSection
            id="pwr-gold"
            title="PWR Gold"
            description="Our most popular paid competitions."
            viewAllHref="/competitions?tier=gold"
            competitions={gold}
          />

          <TierSection
            id="pwr-platinum"
            title="PWR Platinum"
            description="Higher-value competitions."
            viewAllHref="/competitions?tier=platinum"
            comingSoon
          />

          <TierSection
            id="pwr-vip"
            title="PWR VIP"
            description="Higher-value competitions."
            viewAllHref="/competitions?tier=vip"
            comingSoon
          />
        </div>
      </div>
    </div>
  );
}