"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Check, Loader2, Ticket as TicketIcon } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { AmbientBlobs } from "@/components/motion/ambient-blobs";
import { FilterPills } from "@/components/landing/competitions/filter-pills";
import { COMPETITION_CATEGORY_LABELS, type Competition } from "@/lib/types";
import {
  purchaseTickets,
  type CheckoutFormState,
} from "@/app/actions/checkout";

const easeOut = [0.16, 1, 0.3, 1] as const;
const skillAnswers = ["42", "London", "7"] as const;
const CORRECT_ANSWER = "London";

export function CheckoutForm({ competition }: { competition: Competition }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<
    CheckoutFormState,
    FormData
  >(purchaseTickets, undefined);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const ticketsLeft = competition.totalTickets - competition.ticketsSold;

  useEffect(() => {
    if (!state?.error || !errorRef.current) return;
    gsap.fromTo(
      errorRef.current,
      { x: -6 },
      { x: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" },
    );
  }, [state?.error]);

  return (
    <>
      <AmbientBlobs />

      <div className="relative mx-auto w-full max-w-xl px-4 py-14 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
        >
          <Link
            href={`/competitions/${competition.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to competition
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: easeOut }}
          className="mt-4"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
            {COMPETITION_CATEGORY_LABELS[competition.category]}
          </p>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight uppercase sm:text-3xl">
            {competition.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Answer the skill question to claim your one free ticket for this
            competition.
          </p>
        </motion.div>

        <motion.form
          action={formAction}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
          className="mt-8 rounded-3xl bg-white p-6 text-neutral-900 shadow-2xl sm:p-8"
        >
          <input type="hidden" name="competitionId" value={competition.id} />
          <input type="hidden" name="slug" value={competition.slug} />
          <input
            type="hidden"
            name="answerCorrect"
            value={answer === CORRECT_ANSWER ? "true" : ""}
          />

          <p className="text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">
            Skill question
          </p>
          <p className="mt-1 text-base font-bold">
            What is the capital of England?
          </p>

          <FilterPills
            className="mt-4 border border-neutral-200"
            variant="segmented"
            options={skillAnswers.map((option) => ({
              label: option,
              value: option,
            }))}
            value={answer ?? ""}
            onChange={setAnswer}
          />

          <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-5">
            <div>
              <p className="text-[10px] font-semibold tracking-wide text-neutral-400 uppercase">
                Entry
              </p>
              <p className="text-2xl font-extrabold text-brand-gold-dark">
                Free
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
              <TicketIcon className="size-3.5" />
              {ticketsLeft.toLocaleString()} left
            </span>
          </div>

          {state?.error && (
            <p
              ref={errorRef}
              className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
            >
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full rounded-full text-sm font-bold tracking-wide uppercase"
            disabled={!answer || ticketsLeft < 1 || pending}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Entering…
              </>
            ) : (
              <>
                <Check className="size-4" />
                Enter Competition
              </>
            )}
          </Button>

          <p className="mt-4 text-center text-[11px] text-neutral-400">
            No payment required, one ticket per person. Once you enter, your
            ticket number is allocated straight away — just wait for the
            competition to end.
          </p>
        </motion.form>
      </div>
    </>
  );
}
