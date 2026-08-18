"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Competition } from "@/lib/types";
import {
  purchaseTickets,
  type CheckoutFormState,
} from "@/app/actions/checkout";

const skillAnswers = ["42", "London", "7"] as const;
const CORRECT_ANSWER = "London";

export function CheckoutForm({ competition }: { competition: Competition }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<
    CheckoutFormState,
    FormData
  >(purchaseTickets, undefined);

  const ticketsLeft = competition.totalTickets - competition.ticketsSold;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href={`/competitions/${competition.slug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to competition
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">
        {competition.title}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Answer the skill question to claim your one ticket for this
        competition.
      </p>

      <form
        action={formAction}
        className="mt-8 space-y-6 rounded-xl border border-border bg-card p-6"
      >
        <input type="hidden" name="competitionId" value={competition.id} />
        <input type="hidden" name="slug" value={competition.slug} />
        <input
          type="hidden"
          name="answerCorrect"
          value={answer === CORRECT_ANSWER ? "true" : ""}
        />

        <div>
          <Label className="mb-3 block">
            Skill question: What is the capital of England?
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {skillAnswers.map((option) => (
              <Button
                key={option}
                type="button"
                variant={answer === option ? "default" : "outline"}
                onClick={() => setAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tickets</span>
          <span className="text-2xl font-semibold">1 (Free)</span>
        </div>

        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!answer || ticketsLeft < 1 || pending}
        >
          {pending ? "Entering…" : "Enter Competition"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          No payment required, one ticket per person. Once you enter, your
          ticket number is allocated straight away — just wait for the
          competition to end.
        </p>
      </form>
    </div>
  );
}
