"use client";

import { useMemo, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getCompetitionBySlug } from "@/lib/data/competitions";
import { notFound } from "next/navigation";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

const skillAnswers = [
  "42",
  "London",
  "7",
] as const;

export default function CheckoutPage({
  params,
}: PageProps<"/competitions/[slug]/checkout">) {
  const { slug } = use(params);
  const competition = getCompetitionBySlug(slug);
  const [quantity, setQuantity] = useState(1);
  const [answer, setAnswer] = useState<string | null>(null);

  const total = useMemo(
    () => (competition ? competition.ticketPrice * quantity : 0),
    [competition, quantity],
  );

  if (!competition) notFound();

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
        Answer the skill question, choose your tickets, and check out.
      </p>

      <div className="mt-8 space-y-6 rounded-xl border border-border bg-card p-6">
        <div>
          <Label className="mb-3 block">
            Skill question: What is the answer to the question shown on the
            competition page?
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

        <div>
          <Label className="mb-3 block">Number of tickets</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus className="size-4" />
            </Button>
            <Input
              type="number"
              min={1}
              max={ticketsLeft}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(
                    ticketsLeft,
                    Math.max(1, Number(e.target.value) || 1),
                  ),
                )
              }
              className="w-20 text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                setQuantity((q) => Math.min(ticketsLeft, q + 1))
              }
            >
              <Plus className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {ticketsLeft.toLocaleString()} available
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="text-2xl font-semibold">{formatGBP(total)}</span>
        </div>

        <Button size="lg" className="w-full" disabled={!answer}>
          Continue to Payment
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Payment is processed securely by Stripe. Ticket numbers are
          allocated on successful payment.
        </p>
      </div>
    </div>
  );
}
