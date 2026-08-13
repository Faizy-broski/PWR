"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  return (
    <form
      className={cn("flex max-w-xs gap-2", className)}
      onSubmit={(event) => event.preventDefault()}
    >
      <Input
        type="email"
        required
        placeholder="your.email@example.co.uk"
        aria-label="Email address"
        className="h-10 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-brand-gold-light focus-visible:ring-brand-gold-light/30 rounded-full"
      />
      <Button
        type="submit"
        variant="gradient"
        className="h-10 shrink-0 rounded-full px-4 text-xs font-bold tracking-wide uppercase"
      >
        Subscribe
      </Button>
    </form>
  );
}
