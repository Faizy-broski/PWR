import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { FeaturedWinnerCard, type FeaturedWinner } from "./featured-winners-card";

export function FeaturedWinnersSection({
  winners,
  eyebrow = "Real Winners",
  title = "Their Wins, Their Words",
}: {
  winners: FeaturedWinner[];
  eyebrow?: string;
  title?: string;
}) {
  if (winners.length === 0) return null;

  return (
    <section className="py-16 sm:py-0">
      <div className="container">
        <div className="flex flex-col gap-6">
          {winners.map((winner, i) => (
            <Reveal key={winner.id} delay={i * 0.1}>
              <FeaturedWinnerCard winner={winner} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
