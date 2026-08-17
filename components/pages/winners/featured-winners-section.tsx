import { Reveal } from "@/components/motion/reveal";
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
  return (
    <section>
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