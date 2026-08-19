import Link from "next/link";
import { Check, Ticket, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { Countdown } from "@/components/landing/competitions/countdown";
import { CompetitionGallery } from "@/components/pages/competitions/slug/competition-gallery";
import { COMPETITION_CATEGORY_LABELS, type Competition } from "@/lib/types";

function formatGBP(value: number) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
}

export function SlugHero({
    competition,
    myEntry,
}: {
    competition: Competition;
    myEntry: { id: string; ticketNumbers: number[] } | null;
}) {
    const alreadyEntered = myEntry !== null;
    const hasStarted = new Date(competition.startsAt) <= new Date();
    const isLive = competition.status === "live";
    const isOpenForEntry = isLive && hasStarted;
    const canEnter = isOpenForEntry && !alreadyEntered;

    return (
        <>
            <Reveal delay={0.05} duration={0.5}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-12">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
                            {COMPETITION_CATEGORY_LABELS[competition.category]}
                        </p>
                        <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight uppercase sm:text-3xl lg:text-4xl">
                            {competition.title}
                        </h1>
                    </div>

                    {isLive && (
                        <div className="flex items-center gap-3">
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

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_540px] lg:items-start">
                <Reveal delay={0.1}>
                    <CompetitionGallery
                        images={competition.images}
                        title={competition.title}
                    // badge={
                    //   <Badge
                    //     className="absolute top-4 left-4"
                    //     variant={isOpenForEntry ? "default" : "secondary"}
                    //   >
                    //     {isOpenForEntry ? "Live" : isLive ? "Starts soon" : "Closed"}
                    //   </Badge>
                    // }
                    />
                </Reveal>

                <Reveal delay={0.15}>
                    <div className="rounded-3xl bg-white p-8 text-neutral-900 shadow-2xl lg:sticky lg:top-28">
                        <p className="text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">
                            {COMPETITION_CATEGORY_LABELS[competition.category]} competition
                        </p>
                        <h2 className="mt-1 text-lg leading-snug font-extrabold uppercase">
                            {competition.title} + Instant prize on every ticket
                        </h2>

                        <div className="mt-4 flex items-end gap-3 border-y border-neutral-200 py-4">
                            <div>
                                <p className="text-[10px] font-semibold tracking-wide text-neutral-400 uppercase">
                                    Entry
                                </p>
                                <p className="text-3xl font-extrabold text-brand-gold-dark">
                                    Free
                                </p>
                            </div>
                            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-[11px] font-bold text-white">
                                <Trophy className="size-3" />
                                Worth {formatGBP(competition.prizeValue)}
                            </span>
                        </div>

                        <Button
                            size="lg"
                            className="mt-4 w-full rounded-full text-sm font-bold tracking-wide uppercase"
                            disabled={!canEnter}
                            nativeButton={!canEnter}
                            render={
                                canEnter ? (
                                    <Link href={`/competitions/${competition.slug}/checkout`} />
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

                        {isLive && (
                            <div className="mt-3 rounded-full bg-neutral-100 py-2 text-center text-xs font-bold text-neutral-700">
                                {competition.ticketsSold.toLocaleString()} /{" "}
                                {competition.totalTickets.toLocaleString()} tickets claimed
                            </div>
                        )}

                        {alreadyEntered && myEntry && (
                            <Link
                                href={`/competitions/${competition.slug}/entered?tickets=${myEntry.ticketNumbers.join(",")}`}
                                className="mt-3 block text-center text-sm font-medium text-brand-gold-dark underline-offset-2 hover:underline"
                            >
                                View your ticket
                            </Link>
                        )}

                        <ul className="mt-5 space-y-2 pt-5 text-sm text-neutral-600">
                            <li className="flex items-center gap-2">
                                <Check className="size-3.5 shrink-0 text-brand-gold-dark" />
                                Instant prize on every ticket
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-3.5 shrink-0 text-brand-gold-dark" />
                                <span>
                                    Free postal entry route available —{" "}
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
        </>
    );
}
