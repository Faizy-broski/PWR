import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompetitionGrid } from "@/components/competitions/competition-grid";
import { getLiveCompetitions } from "@/lib/data/competitions";
import { ArrowRight, ShieldCheck, Ticket, Trophy } from "lucide-react";

const steps = [
  {
    icon: Ticket,
    title: "Pick a competition",
    description: "Browse live competitions and choose how many tickets to buy.",
  },
  {
    icon: ShieldCheck,
    title: "Answer the question",
    description: "Answer a simple skill question to validate your entry.",
  },
  {
    icon: Trophy,
    title: "We draw a winner",
    description: "When the competition closes, a winning ticket is drawn at random.",
  },
];

export default function Home() {
  const competitions = getLiveCompetitions();

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border/60 bg-linear-to-b from-muted/40 to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6">
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            UK prize competitions
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Win the car, the tech, or the cash — your entry, your choice.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            PWR runs skill-based prize competitions with transparent odds and
            secure, numbered ticket entries. 18+ only.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href="/competitions" />}>
              View Live Competitions
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="#how-it-works" />}
            >
              How It Works
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Live competitions
          </h2>
          <Link
            href="/competitions"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <CompetitionGrid competitions={competitions} />
      </section>

      <section
        id="how-it-works"
        className="border-t border-border/60 bg-muted/30"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-10 text-2xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <step.icon className="size-5" />
                </div>
                <h3 className="font-semibold">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
