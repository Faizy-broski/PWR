"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Lock, PartyPopper } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { LineDraw } from "@/components/motion/line-draw";
import { claimPrize } from "@/app/actions/signups";

const fieldClassName =
  "h-auto rounded-none border-0 border-b border-white/15 bg-transparent px-0 pb-2 text-sm text-white placeholder:text-white/30 shadow-none focus-visible:border-brand-gold-light focus-visible:ring-0";

export interface ClaimPrizeSectionProps {
  /** Whether the signed-in user has a paid entry elsewhere that unlocks this claim. */
  unlocked: boolean;
  /** Whether they've already submitted their guaranteed-win claim. */
  alreadyClaimed: boolean;
  signedIn: boolean;
}

export function ClaimPrizeSection({
  unlocked,
  alreadyClaimed,
  signedIn,
}: ClaimPrizeSectionProps) {
  const [state, action, pending] = useActionState(claimPrize, undefined);
  const claimed = alreadyClaimed || state?.success;

  return (
    <section id="claim-prize" className="scroll-mt-28 py-16 sm:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16">
          <div>
            <Reveal duration={0.5}>
              <p className="text-xs font-semibold tracking-[0.25em] text-brand-gradient uppercase">
                PWR Black Diamond
              </p>
              <h2 className="mt-3 text-2xl font-extrabold text-white uppercase sm:text-3xl">
                Claim Your Prize
              </h2>
              <LineDraw className="mt-3" delay={0.3} />

              <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-white/50">
                Guaranteed winners of PWR Black Diamond fill in their details
                below so we can ship your tech bundle — EarPods, MacBook and
                Powerbank included.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            {!unlocked ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 p-10 text-center sm:p-16">
                <Lock className="size-10 text-brand-gold-light" />
                <h3 className="text-xl font-extrabold text-white uppercase">
                  Locked
                </h3>
                <p className="max-w-[38ch] text-sm text-white/50">
                  {signedIn
                    ? "Purchase an entry to any competition first — that unlocks your guaranteed tech bundle here."
                    : "Sign in and purchase an entry to any competition first — that unlocks your guaranteed tech bundle here."}
                </p>
                <Button
                  variant="gradient"
                  className="mt-2 h-11 rounded-full px-8 text-sm font-bold"
                  render={
                    <Link href={signedIn ? "/competitions" : "/login"} />
                  }
                >
                  {signedIn ? "Browse Competitions" : "Sign In"}
                </Button>
              </div>
            ) : claimed ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 p-10 text-center sm:p-16">
                <PartyPopper className="size-10 text-brand-gold-light" />
                <h3 className="text-xl font-extrabold text-white uppercase">
                  Details received
                </h3>
                <p className="max-w-[38ch] text-sm text-white/50">
                  Thanks — we&apos;ve got your details. Our team will be in
                  touch to arrange delivery of your tech bundle.
                </p>
              </div>
            ) : (
              <form action={action} className="relative space-y-8 rounded-3xl border border-white/10 p-6 sm:p-10">
                <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
                      Full Name
                    </Label>
                    <Input id="fullName" name="fullName" placeholder="Your full name" required className={fieldClassName} />
                    {state?.errors?.fullName && (
                      <p className="text-xs text-destructive">{state.errors.fullName[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
                      Email
                    </Label>
                    <Input id="email" name="email" type="email" placeholder="you@email.com" required className={fieldClassName} />
                    {state?.errors?.email && (
                      <p className="text-xs text-destructive">{state.errors.email[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
                      Phone
                    </Label>
                    <Input id="phone" name="phone" type="tel" placeholder="07000 000000" required className={fieldClassName} />
                    {state?.errors?.phone && (
                      <p className="text-xs text-destructive">{state.errors.phone[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postcode" className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
                      Postcode
                    </Label>
                    <Input id="postcode" name="postcode" placeholder="SW1A 1AA" required className={fieldClassName} />
                    {state?.errors?.postcode && (
                      <p className="text-xs text-destructive">{state.errors.postcode[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="addressLine1" className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
                      Address Line 1
                    </Label>
                    <Input id="addressLine1" name="addressLine1" placeholder="Street address" required className={fieldClassName} />
                    {state?.errors?.addressLine1 && (
                      <p className="text-xs text-destructive">{state.errors.addressLine1[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="addressLine2" className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
                      Address Line 2 (optional)
                    </Label>
                    <Input id="addressLine2" name="addressLine2" placeholder="Apartment, suite, etc." className={fieldClassName} />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="city" className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
                      City
                    </Label>
                    <Input id="city" name="city" placeholder="Your city" required className={fieldClassName} />
                    {state?.errors?.city && (
                      <p className="text-xs text-destructive">{state.errors.city[0]}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={pending}
                    className="h-12 w-full rounded-full px-8 text-sm font-bold"
                  >
                    {pending ? "Submitting…" : "Claim My Prize"}
                  </Button>
                  {state?.message && (
                    <p className="mt-4 text-center text-xs text-destructive">{state.message}</p>
                  )}
                  <p className="mt-4 text-center text-[11px] text-white/35">
                    18+ UK residents only. Your details are used solely to
                    verify and deliver your prize.
                  </p>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
