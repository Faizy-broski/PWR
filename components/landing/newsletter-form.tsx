"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter } from "@/app/actions/signups";

export function NewsletterForm({ className }: { className?: string }) {
  const [state, action, pending] = useActionState(
    subscribeToNewsletter,
    undefined,
  );

  if (state?.success) {
    return (
      <p className={cn("max-w-xs text-sm text-white/60", className)}>
        You&apos;re subscribed — thanks for signing up.
      </p>
    );
  }

  return (
    <form action={action} className={cn("flex max-w-xs flex-col gap-2", className)}>
      <div className="flex gap-2">
        <Input
          type="email"
          name="email"
          required
          placeholder="your.email@example.co.uk"
          aria-label="Email address"
          className="h-10 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-brand-gold-light focus-visible:ring-brand-gold-light/30 rounded-full"
        />
        <Button
          type="submit"
          variant="gradient"
          disabled={pending}
          className="h-10 shrink-0 rounded-full px-4 text-xs font-bold tracking-wide uppercase"
        >
          {pending ? "…" : "Subscribe"}
        </Button>
      </div>
      {state?.error && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
      <p className="text-[11px] text-white/35">
        By subscribing you agree to receive PWR updates by email. Unsubscribe
        any time.
      </p>
    </form>
  );
}
