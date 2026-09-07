"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CompetitionCategory } from "@/lib/types";
import { notifyMeForTier } from "@/app/actions/signups";

export function ComingSoonBanner({
  tier,
  title = "Coming Soon",
  description = "Exciting high-value competitions on the way, stay tuned.",
  notifyLabel = "Get Notified",
}: {
  tier: CompetitionCategory;
  title?: string;
  description?: string;
  notifyLabel?: string;
}) {
  const [state, action, pending] = useActionState(notifyMeForTier, undefined);

  return (
    <div className="mt-5 flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center">
          <img src="/svg's/lock.svg" className="size-11" />
        </span>
        <div>
          <h3 className="text-xl font-extrabold text-white uppercase">
            {title}
          </h3>
          <p className="mt-1 max-w-[30ch] text-xs leading-relaxed text-white/40">
            {description}
          </p>
        </div>
      </div>

      {state?.success ? (
        <p className="text-xs font-semibold text-brand-gold-light uppercase">
          You&apos;re on the list — we&apos;ll email you.
        </p>
      ) : (
        <form action={action} className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <input type="hidden" name="tier" value={tier} />
          <Input
            type="email"
            name="email"
            required
            placeholder="your.email@example.co.uk"
            aria-label="Email address"
            className="h-10 w-full rounded-full border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-brand-gold-light focus-visible:ring-brand-gold-light/30 sm:w-48"
          />
          <Button
            type="submit"
            variant="outline"
            disabled={pending}
            className="h-10 w-full shrink-0 rounded-full bg-white px-8 text-xs font-bold tracking-widest text-black uppercase sm:w-auto"
          >
            {pending ? "…" : notifyLabel}
          </Button>
        </form>
      )}
      {state?.error && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
    </div>
  );
}
