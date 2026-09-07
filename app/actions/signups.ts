"use server";

import * as z from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { COMPETITION_CATEGORIES, type CompetitionCategory } from "@/lib/types";

export type NewsletterFormState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

const NewsletterSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
});

// Storage-only for now: PWR's marketing API integration is parked (see
// AGENTS.md item 27) — this table is the system of record until that's
// wired up, at which point this action also pushes to that API.
export async function subscribeToNewsletter(
  _state: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const validated = NewsletterSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validated.success) {
    return { error: "Enter a valid email address." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("newsletter_signups")
    .upsert(
      { email: validated.data.email, unsubscribed_at: null },
      { onConflict: "email" },
    );

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}

export type NotifyFormState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

const NotifySchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
  tier: z.enum(COMPETITION_CATEGORIES as [CompetitionCategory, ...CompetitionCategory[]]),
});

export async function notifyMeForTier(
  _state: NotifyFormState,
  formData: FormData,
): Promise<NotifyFormState> {
  const validated = NotifySchema.safeParse({
    email: formData.get("email"),
    tier: formData.get("tier"),
  });

  if (!validated.success) {
    return { error: "Enter a valid email address." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("tier_notify_signups")
    .upsert(validated.data, { onConflict: "email,tier" });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
