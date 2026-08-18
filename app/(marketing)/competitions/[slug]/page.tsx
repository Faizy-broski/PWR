import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ChevronDown, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Reveal } from "@/components/motion/reveal";
import { Countdown } from "@/components/landing/competitions/countdown";
import { CompetitionGallery } from "@/components/landing/competitions/competition-gallery";
import { CompetitionListingCard } from "@/components/landing/competitions/competition-listing-card";
import { WhyWeLoveIt } from "@/components/landing/competitions/why-we-love-it";
import {
  getCompetitionBySlug,
  getLiveCompetitions,
  mapCompetition,
  toFeaturedCompetition,
} from "@/lib/data/competitions";
import { getMyEntryMap } from "@/lib/data/entries";
import { COMPETITION_CATEGORY_LABELS } from "@/lib/types";
import { createServiceClient } from "@/lib/supabase/service";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

// Real, existing site-wide stats (same figures shown on /winners — see
// components/pages/winners/winners-hero.tsx) — kept in sync with that copy
// rather than fabricated for this page.
const SITE_STATS = [
  { value: "26+", label: "Years Running" },
  { value: "£166M+", label: "In Prizes Won" },
  { value: "833K+", label: "Winners" },
] as const;

const HOW_IT_WORKS_FAQS = [
  {
    question: "How do I enter this competition?",
    answer:
      "Answer the skill question on the checkout page and claim your ticket — entry is free and your ticket number is allocated straight away.",
  },
  {
    question: "How many tickets can I get?",
    answer:
      "One ticket per person, per competition, to keep every entrant's odds fair.",
  },
  {
    question: "When is the winner announced?",
    answer:
      "Once this competition closes and all tickets are allocated, a winning ticket number is drawn and the winner is announced.",
  },
  {
    question: "Is there a free postal entry route?",
    answer:
      "Yes — see our free entry route page for full details on entering without claiming a ticket online.",
  },
] as const;

export async function generateStaticParams() {
  // Runs at build time with no request context, so it can't use the
  // cookie-based server client (see lib/supabase/server.ts).
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("competitions")
    .select("*")
    .eq("status", "live")
    .lte("starts_at", new Date().toISOString());

  return (data ?? []).map(mapCompetition).map((c) => ({ slug: c.slug }));
}

export default async function CompetitionDetailPage({
  params,
}: PageProps<"/competitions/[slug]">) {
  const { slug } = await params;
  const competition = await getCompetitionBySlug(slug);

  if (!competition) notFound();

  const [myEntries, liveCompetitions] = await Promise.all([
    getMyEntryMap(),
    getLiveCompetitions(),
  ]);
  const myEntry = myEntries.get(competition.id) ?? null;
  const alreadyEntered = myEntry !== null;

  const percentSold = Math.min(
    100,
    Math.round((competition.ticketsSold / competition.totalTickets) * 100),
  );
  const ticketsLeft = competition.totalTickets - competition.ticketsSold;
  const hasStarted = new Date(competition.startsAt) <= new Date();
  const isLive = competition.status === "live";
  const isOpenForEntry = isLive && hasStarted;
  const canEnter = isOpenForEntry && !alreadyEntered;

  const moreCompetitions = liveCompetitions
    .filter((c) => c.slug !== competition.slug)
    .slice(0, 3)
    .map((c) => toFeaturedCompetition(c, myEntries.has(c.id)));

  return (
    <div className="dark min-h-screen -mt-18 bg-background pt-18 text-foreground sm:-mt-20 sm:pt-20 lg:-mt-24 lg:pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Reveal duration={0.5}>
          <Link
            href="/competitions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to competitions
          </Link>
        </Reveal>

        <Reveal delay={0.05} duration={0.5}>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
                {COMPETITION_CATEGORY_LABELS[competition.category]}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight uppercase sm:text-4xl lg:text-5xl">
                {competition.title}
              </h1>
            </div>

            {isLive && (
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  {hasStarted ? "Ends in" : "Starts in"}
                </span>
                <Countdown
                  closesAt={
                    hasStarted ? competition.closesAt : competition.startsAt
                  }
                  variant="cards-light"
                />
              </div>
            )}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <Reveal delay={0.1}>
            <CompetitionGallery
              images={competition.images}
              title={competition.title}
              badge={
                <Badge
                  className="absolute top-4 left-4"
                  variant={isOpenForEntry ? "default" : "secondary"}
                >
                  {isOpenForEntry ? "Live" : isLive ? "Starts soon" : "Closed"}
                </Badge>
              }
            />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-3xl bg-white p-6 text-neutral-900 shadow-2xl lg:sticky lg:top-28">
              <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                {COMPETITION_CATEGORY_LABELS[competition.category]}{" "}
                competition
              </p>
              <h2 className="mt-1 text-xl leading-snug font-bold">
                {competition.title}
              </h2>

              <div className="mt-5 border-t border-neutral-200 pt-5">
                <p className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                  Entry
                </p>
                <p className="text-3xl font-extrabold text-brand-gold-dark">
                  Free
                </p>
              </div>

              <Button
                size="lg"
                className="mt-5 w-full rounded-full text-sm font-bold tracking-wide uppercase"
                disabled={!canEnter}
                nativeButton={!canEnter}
                render={
                  canEnter ? (
                    <Link
                      href={`/competitions/${competition.slug}/checkout`}
                    />
                  ) : undefined
                }
              >
                <Ticket className="size-4" />
                {alreadyEntered
                  ? "Already Entered"
                  : isOpenForEntry
                    ? "Enter Now"
                    : isLive
                      ? "Starts Soon"
                      : "Competition Closed"}
              </Button>

              {alreadyEntered && myEntry && (
                <Link
                  href={`/competitions/${competition.slug}/entered?tickets=${myEntry.ticketNumbers.join(",")}`}
                  className="mt-3 block text-center text-sm font-medium text-brand-gold-dark underline-offset-2 hover:underline"
                >
                  View your ticket
                </Link>
              )}

              <ul className="mt-5 space-y-2 border-t border-neutral-200 pt-5 text-sm text-neutral-600">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 shrink-0 text-brand-gold-dark" />
                  One ticket per person
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 shrink-0 text-brand-gold-dark" />
                  <span>
                    Free postal entry available —{" "}
                    <Link
                      href="/free-entry"
                      className="underline underline-offset-2"
                    >
                      see details
                    </Link>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 shrink-0 text-brand-gold-dark" />
                  Winner announced once this competition closes
                </li>
              </ul>

              <p className="mt-4 text-[11px] text-neutral-400">
                18+ UK residents only.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
            Entries for this competition
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every ticket gets you one entry into the draw.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { value: competition.ticketsSold.toLocaleString(), label: "Entered" },
              { value: ticketsLeft.toLocaleString(), label: "Left" },
              {
                value: competition.totalTickets.toLocaleString(),
                label: "Max tickets",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card px-6 py-5"
              >
                <p className="text-2xl font-extrabold tabular-nums text-brand-gold-light sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Progress value={percentSold} className="mt-4" />
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <WhyWeLoveIt
            image={competition.images[1] ?? competition.images[0]}
            description={competition.description}
            facts={[
              { label: "Prize value", value: formatGBP(competition.prizeValue) },
              {
                label: "Total tickets",
                value: competition.totalTickets.toLocaleString(),
              },
              { label: "Opens", value: formatDate(competition.startsAt) },
              { label: "Closes", value: formatDate(competition.closesAt) },
            ]}
          />
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-14 bg-brand-gradient py-8">
          <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-white/25 px-4 text-center text-white sm:px-6">
            {SITE_STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-extrabold sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold tracking-wide uppercase sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <Reveal>
          <h2 className="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
            How entering works
          </h2>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {HOW_IT_WORKS_FAQS.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>

        {moreCompetitions.length > 0 && (
          <Reveal delay={0.1} className="mt-16">
            <h2 className="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
              More competitions
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreCompetitions.map((c) => (
                <CompetitionListingCard key={c.slug} competition={c} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
