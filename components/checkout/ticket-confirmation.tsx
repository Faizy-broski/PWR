"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { PartyPopper, Ticket as TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/landing/competitions/countdown";
import { ConfettiBurst } from "@/components/checkout/confetti-burst";
import type { Competition } from "@/lib/types";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function TicketConfirmation({
  competition,
  ticketNumbers,
}: {
  competition: Competition;
  ticketNumbers: string[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 sm:px-6">
      <ConfettiBurst />

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="flex size-20 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg shadow-brand-gold-dark/30"
      >
        <PartyPopper className="size-9" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
        className="flex flex-col items-center text-center"
      >
        <span className="mt-6 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold tracking-wider text-primary uppercase">
          Entry confirmed
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          You&apos;re <span className="text-brand-gradient">in!</span>
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          You&apos;ve taken part in{" "}
          <span className="font-medium text-foreground">
            {competition.title}
          </span>
          . Sit tight — the winner is drawn the moment this competition
          closes.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: easeOut }}
        className="relative mt-8 w-full max-w-md rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex">
          <div className="relative w-32 shrink-0 overflow-hidden rounded-l-2xl sm:w-40">
            <Image
              src={competition.images[0]}
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          </div>

          <div className="flex flex-1 flex-col justify-center gap-1.5 p-5">
            <p className="truncate text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {competition.title}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <TicketIcon className="size-3.5 shrink-0" />
              Ticket number{ticketNumbers.length > 1 ? "s" : ""}
            </div>
            <p className="text-2xl font-extrabold tabular-nums text-brand-gradient sm:text-3xl">
              {ticketNumbers.join(" · ")}
            </p>
          </div>
        </div>

        <div className="absolute inset-y-3 left-32 w-px border-l border-dashed border-border sm:left-40" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45, ease: easeOut }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <span className="text-sm font-medium text-muted-foreground">
          Competition closes in
        </span>
        <Countdown closesAt={competition.closesAt} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease: easeOut }}
        className="mt-10 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2"
      >
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/competitions/${competition.slug}`} />}
        >
          Back to competition
        </Button>
        <Button
          nativeButton={false}
          render={<Link href="/competitions" />}
        >
          Browse more competitions
        </Button>
      </motion.div>
    </div>
  );
}
