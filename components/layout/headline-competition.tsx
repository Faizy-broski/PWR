import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Countdown } from "@/components/landing/competitions/countdown";
import { Button } from "@/components/ui/button";

export interface HeadlineCompetitionProps {
  slug: string;
  image: string;
  title: string;
  emphasis: string;
  description: string;
  prizeValue: number;
  ticketPrice: number;
  closesAt: string;
}

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

const defaultCompetition: HeadlineCompetitionProps = {
  slug: "porsche-911-gt3",
  image: "/headline-competition.png",
  title: "Win the Ultimate",
  emphasis: "Performance",
  description:
    "A twin-turbo coupé, twelve months of insurance and £5,000 in cash — delivered to your door within seven days of the draw.",
  prizeValue: 50000,
  ticketPrice: 2.99,
  closesAt: "2026-08-25T18:00:00.000Z",
};

export function HeadlineCompetition({
  competition = defaultCompetition,
}: {
  competition?: HeadlineCompetitionProps;
}) {
  const { slug, image, title, emphasis, description, prizeValue, ticketPrice, closesAt } =
    competition;

  return (
    <section className="bg-[#0B0B0B] py-16 sm:py-20 lg:py-24">
      <div className="container grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal direction="right" distance={32}>
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl">
            <Image
              src={image}
              alt={`${title} ${emphasis}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div>
          <Reveal direction="down" distance={12} duration={0.5}>
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
              — Headline Competition
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-4xl leading-[1.05] font-extrabold text-white uppercase sm:text-5xl">
              {title}
              <br />
              <span className="font-script">{emphasis}</span>
              <br />
              Package
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-5 max-w-md text-sm text-white/60 sm:text-base">
              {description}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex items-center gap-10">
              <div>
                <div className="text-xs tracking-wide text-white/50 uppercase">
                  Prize value
                </div>
                <div className="text-2xl font-bold text-brand-gold-light">
                  {formatGBP(prizeValue)}+
                </div>
              </div>
              <div>
                <div className="text-xs tracking-wide text-white/50 uppercase">
                  Entry
                </div>
                <div className="text-2xl font-bold text-white">
                  From {formatGBP(ticketPrice)}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-6">
              <Countdown closesAt={closesAt} variant="inline-dark" />
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <Magnetic strength={0.25} className="mt-8 block w-full sm:w-auto">
              <Button
                variant="gradient"
                nativeButton={false}
                render={<Link href={`/competitions/${slug}`} />}
                className="h-12 w-full rounded-full px-10 text-xs font-bold tracking-widest uppercase sm:w-auto"
              >
                Enter Competition
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
