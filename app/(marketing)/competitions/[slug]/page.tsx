import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Reveal } from "@/components/motion/reveal";
import { WhyWeLoveIt } from "@/components/landing/competitions/why-we-love-it";
import { SlugHero } from "@/components/pages/competitions/slug/slug-hero";
import { PrizeRowCard } from "@/components/pages/competitions/slug/prize-row-card";
import { TrendingNow } from "@/components/pages/competitions/slug/trending-now";
import { FaqAccordion } from "@/components/pages/competitions/slug/faq-accordion";
import {
  getCompetitionBySlug,
  getLiveCompetitions,
  mapCompetition,
  toFeaturedCompetition,
} from "@/lib/data/competitions";
import { getMyEntryMap } from "@/lib/data/entries";
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

  const percentSold = Math.min(
    100,
    Math.round((competition.ticketsSold / competition.totalTickets) * 100),
  );
  const ticketsLeft = competition.totalTickets - competition.ticketsSold;

  const moreCompetitions = liveCompetitions
    .filter((c) => c.slug !== competition.slug)
    .slice(0, 6)
    .map((c) => toFeaturedCompetition(c, myEntries.has(c.id)));

  // "Trending" = most tickets sold, since we don't track view/click counts —
  // the closest real signal we have for what's popular right now.
  const trendingCompetitions = liveCompetitions
    .filter((c) => c.slug !== competition.slug)
    .toSorted((a, b) => b.ticketsSold - a.ticketsSold)
    .slice(0, 3)
    .map((c) => toFeaturedCompetition(c, myEntries.has(c.id)));

  return (
    <div className="dark min-h-screen -mt-18 bg-background pt-18 text-foreground sm:-mt-20 sm:pt-20 lg:-mt-24 lg:pt-24">
      <div className="container py-8 sm:py-10">
        <Reveal duration={0.5}>
          <Link
            href="/competitions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to competitions
          </Link>
        </Reveal>

        <SlugHero competition={competition} myEntry={myEntry} />

        <Reveal delay={0.1} className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
            Instant wins for this competition
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
                className="rounded border border-border bg-card px-6 py-5"
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
          <div className="container grid grid-cols-3 divide-x divide-white/25 text-center text-white">
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

      <div className="container py-14">
        {moreCompetitions.length > 0 && (
          <Reveal>
            <h2 className="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
              Prizes you can win
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {moreCompetitions.map((c) => (
                <PrizeRowCard key={c.slug} competition={c} />
              ))}
            </div>

            <Link
              href="/competitions"
              className="mt-3 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-neutral-900 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-xs font-semibold text-neutral-500 uppercase">
                Prefer skill to luck?
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-brand-gold-dark uppercase">
                Browse all competitions
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          </Reveal>
        )}

        <Reveal delay={0.1} className={moreCompetitions.length > 0 ? "mt-16" : undefined}>
          <h2 className="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
            How instant wins work
          </h2>
          <div className="mt-6">
            <FaqAccordion items={HOW_IT_WORKS_FAQS} />
          </div>
        </Reveal>

        {trendingCompetitions.length > 0 && (
          <Reveal delay={0.1} className="mt-16">
            <TrendingNow competitions={trendingCompetitions} />
          </Reveal>
        )}
      </div>
    </div>
  );
}
