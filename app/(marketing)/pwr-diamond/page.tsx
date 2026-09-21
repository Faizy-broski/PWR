import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plane, Ticket, Users, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { LineDraw } from "@/components/motion/line-draw";
import { FaqAccordion } from "@/components/pages/competitions/slug/faq-accordion";
import { FloatingDiamonds } from "@/components/motion/floating-diamonds";
import { getCompetitionBySlug } from "@/lib/data/competitions";
import { getMyEntryMap, hasPaidEntry } from "@/lib/data/entries";
import { getCurrentUser } from "@/lib/supabase/dal";

export const metadata: Metadata = {
  title: "PWR Diamond — Win a 2-Night Holiday for Two",
  description:
    "PWR Diamond is completely free to enter. 250 spots, one free entry each, giving away a 2-night holiday for two.",
};

const FAQS = [
  {
    question: "How much does it cost to enter?",
    answer:
      "Your spot itself is free. To unlock it you'll need one paid entry to any competition first — after that, PWR Diamond is yours to enter at no extra cost.",
  },
  {
    question: "How many entries do I get?",
    answer: "One free entry per person, so every one of the 250 spots gets a fair, equal chance.",
  },
  {
    question: "What's the prize?",
    answer: "A 2-night holiday for two — flights, hotel and all the details confirmed with the winner directly.",
  },
  {
    question: "When is the winner announced?",
    answer: "Once all 250 spots are filled, a winning entry is drawn and the winner is announced.",
  },
] as const;

export default async function PwrDiamondPage() {
  const competition = await getCompetitionBySlug("pwr-diamond");
  if (!competition) notFound();

  const [profile, myEntries, unlocked] = await Promise.all([
    getCurrentUser(),
    getMyEntryMap(),
    hasPaidEntry(),
  ]);
  const myEntry = myEntries.get(competition.id) ?? null;
  const alreadyEntered = myEntry !== null;

  const hasStarted = new Date(competition.startsAt) <= new Date();
  const isLive = competition.status === "live";
  const isOpenForEntry = isLive && hasStarted;
  const canEnter = isOpenForEntry && !alreadyEntered && unlocked;
  const canUnlock = !unlocked && !alreadyEntered;
  const ctaEnabled = canEnter || canUnlock;

  const ticketsLeft = competition.totalTickets - competition.ticketsSold;
  const percentFilled = Math.min(
    100,
    Math.round((competition.ticketsSold / competition.totalTickets) * 100),
  );

  return (
    <div className="dark relative -mt-18 min-h-screen bg-background pt-32 text-foreground sm:-mt-20 sm:pt-36 lg:-mt-24 lg:pt-40">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <FloatingDiamonds travel={1.4} />
        <div className="absolute top-0 left-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold-dark/10 blur-[120px]" />
      </div>
      <div className="container relative">
        <div className="text-center">
          <Reveal duration={0.5}>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-brand-gradient uppercase">
              <Plane className="size-3.5" />
              PWR Diamond — Free to Enter
            </p>
          </Reveal>

          <h1 className="text-4xl leading-[1.1] font-extrabold uppercase sm:text-5xl lg:text-6xl">
            <TextReveal text="Win A Holiday" delay={0.1} className="block" />
            <span className="block">
              <TextReveal text="For Two" delay={0.3} />
            </span>
          </h1>

          <Reveal delay={0.4}>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A 2-night holiday for two, completely free to enter. Just 250
              spots, one free entry per person — once they&apos;re gone,
              they&apos;re gone.
            </p>
          </Reveal>

          {canUnlock && (
            <Reveal delay={0.45}>
              <p className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 text-xs font-semibold tracking-wide text-brand-gold-light uppercase">
                <Lock className="size-3.5" />
                Purchase one paid entry to unlock your free spot
              </p>
            </Reveal>
          )}

          <Reveal delay={0.5}>
            <Button
              size="lg"
              variant="gradient"
              className="mt-8 rounded-full px-8 text-sm font-bold tracking-wide uppercase"
              disabled={!ctaEnabled}
              nativeButton={!ctaEnabled}
              render={
                canEnter ? (
                  <Link href={`/competitions/${competition.slug}/checkout`} />
                ) : canUnlock ? (
                  <Link href={profile ? "/competitions" : "/login"} />
                ) : undefined
              }
            >
              <Ticket className="size-4" />
              {alreadyEntered
                ? "Already Entered"
                : canUnlock
                  ? profile
                    ? "Unlock With A Paid Entry"
                    : "Sign In To Unlock"
                  : isOpenForEntry
                    ? "Enter Free"
                    : isLive
                      ? "Starts Soon"
                      : "Competition Closed"}
              {ctaEnabled && <ArrowRight className="size-4" />}
            </Button>

            {alreadyEntered && myEntry && (
              <div>
                <Link
                  href={`/competitions/${competition.slug}/entered?tickets=${myEntry.ticketNumbers.join(",")}`}
                  className="mt-3 inline-block text-sm font-medium text-brand-gold-dark underline-offset-2 hover:underline"
                >
                  View your ticket
                </Link>
              </div>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.55} className="mt-14">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { value: competition.ticketsSold.toLocaleString(), label: "Entered" },
              { value: ticketsLeft.toLocaleString(), label: "Spots left" },
              { value: competition.totalTickets.toLocaleString(), label: "Max spots" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded border border-border bg-card px-6 py-5 text-center"
              >
                <p className="text-2xl font-extrabold tabular-nums text-brand-gradient sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-4 max-w-2xl">
            <Progress value={percentFilled} />
          </div>
        </Reveal>

        <div className="mt-20 pb-20">
          <Reveal>
            <h2 className="text-center text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
              Why you&apos;ll love it
            </h2>
            <div className="mx-auto mt-3 flex justify-center">
              <LineDraw />
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: Plane,
                title: "2 Nights Away",
                description: "A short break for two, wherever the prize takes you.",
              },
              {
                icon: Ticket,
                title: "Free To Enter",
                description: "One paid entry anywhere unlocks your free spot here.",
              },
              {
                icon: Users,
                title: "250 Spots Only",
                description: "Fair odds for everyone, capped at 250 entrants.",
              },
            ].map((item) => (
              <RevealItem key={item.title}>
                <div className="flex h-full flex-col items-center rounded-2xl border border-border bg-card px-6 py-10 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-brand-gradient">
                    <item.icon className="size-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-base font-extrabold tracking-tight uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-16">
            <h2 className="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
              Frequently asked questions
            </h2>
            <div className="mt-6">
              <FaqAccordion items={FAQS} />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
