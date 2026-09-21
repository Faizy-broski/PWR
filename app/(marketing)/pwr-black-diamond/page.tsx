import type { Metadata } from "next";
import Link from "next/link";
import { Headphones, Laptop, BatteryCharging, Gem, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { LineDraw } from "@/components/motion/line-draw";
import { FloatingDiamonds } from "@/components/motion/floating-diamonds";
import { getCurrentUser } from "@/lib/supabase/dal";
import { hasPaidEntry, getMyPrizeClaim } from "@/lib/data/entries";

export const metadata: Metadata = {
  title: "PWR Black Diamond — Guaranteed Win",
  description:
    "Enter PWR Black Diamond and you're guaranteed to win a tech bundle: Apple EarPods, a MacBook and a Powerbank.",
};

const prizes = [
  {
    icon: Headphones,
    name: "Apple EarPods",
    description: "Wireless earbuds for calls, music and everything in between.",
  },
  {
    icon: Laptop,
    name: "Apple MacBook",
    description: "A brand new MacBook to work, create and play on.",
  },
  {
    icon: BatteryCharging,
    name: "Powerbank",
    description: "Keep every device charged, wherever you are.",
  },
];

export default async function PwrBlackDiamondPage() {
  const profile = await getCurrentUser();
  const [unlocked, existingClaim] = await Promise.all([
    hasPaidEntry(),
    getMyPrizeClaim(),
  ]);
  const alreadyClaimed = existingClaim !== null;

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
              <Gem className="size-3.5" />
              PWR Black Diamond
            </p>
          </Reveal>

          <h1 className="text-4xl leading-[1.1] font-extrabold uppercase sm:text-5xl lg:text-6xl">
            <TextReveal text="Guaranteed" delay={0.1} className="block" />
            <span className="block">
              <TextReveal text="To Win" delay={0.3} />
            </span>
          </h1>

          <Reveal delay={0.4}>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              No draw, no odds, no waiting around. Every entry to PWR Black
              Diamond wins the full tech bundle — Apple EarPods, a MacBook and
              a Powerbank.
            </p>
          </Reveal>

          {!unlocked && (
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
              disabled={alreadyClaimed}
              nativeButton={alreadyClaimed}
              render={
                alreadyClaimed ? undefined : (
                  <Link
                    href={
                      unlocked
                        ? "/winners#claim-prize"
                        : profile
                          ? "/competitions"
                          : "/login"
                    }
                  />
                )
              }
            >
              {alreadyClaimed
                ? "Prize Claimed"
                : unlocked
                  ? "Claim Your Prize"
                  : profile
                    ? "Unlock With A Paid Entry"
                    : "Sign In To Unlock"}
              {!alreadyClaimed && <ArrowRight className="size-4" />}
            </Button>
          </Reveal>
        </div>

        <div className="mt-20 pb-20">
          <Reveal>
            <h2 className="text-center text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
              What&apos;s in the bundle
            </h2>
            <div className="mx-auto mt-3 flex justify-center">
              <LineDraw />
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {prizes.map((prize) => (
              <RevealItem key={prize.name}>
                <div className="flex h-full flex-col items-center rounded-2xl border border-border bg-card px-6 py-10 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-brand-gradient">
                    <prize.icon className="size-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-base font-extrabold tracking-tight uppercase">
                    {prize.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {prize.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-14 text-center">
            <h2 className="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
              How it works
            </h2>
            <div className="mx-auto mt-3 flex justify-center">
              <LineDraw />
            </div>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Purchase one paid entry to any competition and your free spot
              on PWR Black Diamond unlocks automatically. From there, hit
              &quot;Claim Your Prize&quot; and fill in your details on our
              winners page — since Black Diamond is a guaranteed win,
              there&apos;s no draw to wait for and our team gets straight to
              arranging delivery of your tech bundle.
            </p>
            <p className="mx-auto mt-4 max-w-lg text-xs text-muted-foreground/70">
              18+ UK residents only. One guaranteed prize per person.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
