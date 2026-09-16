"use server";

import * as z from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { COMPETITION_CATEGORIES, type CompetitionCategory } from "@/lib/types";
import { getCurrentUser } from "@/lib/supabase/dal";
import { hasPaidEntry, getMyPrizeClaim } from "@/lib/data/entries";

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

export type PrizeClaimFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
    }
  | undefined;

const PrizeClaimSchema = z.object({
  fullName: z.string().trim().min(2, { error: "Enter your full name." }),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  phone: z.string().trim().min(5, { error: "Enter a valid phone number." }),
  addressLine1: z.string().trim().min(3, { error: "Enter your address." }),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(2, { error: "Enter your city." }),
  postcode: z.string().trim().min(3, { error: "Enter your postcode." }),
});

// Guaranteed-win claim for the PWR Black Diamond page (app/(marketing)/pwr-black-diamond) —
// unlike raffle competitions, entering that page guarantees the tech bundle
// prize, so there's no draw to run: we just capture shipping details here.
export async function claimPrize(
  _state: PrizeClaimFormState,
  formData: FormData,
): Promise<PrizeClaimFormState> {
  const profile = await getCurrentUser();
  if (!profile) {
    return { message: "Sign in to claim your prize." };
  }

  const [unlocked, existingClaim] = await Promise.all([
    hasPaidEntry(),
    getMyPrizeClaim(),
  ]);

  if (!unlocked) {
    return {
      message:
        "Purchase an entry to any competition first to unlock your guaranteed prize.",
    };
  }

  if (existingClaim) {
    return { message: "You've already claimed your prize." };
  }

  const validated = PrizeClaimSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    city: formData.get("city"),
    postcode: formData.get("postcode"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = createServiceClient();
  const { fullName, addressLine1, addressLine2, ...rest } = validated.data;
  const { error } = await supabase.from("prize_claims").insert({
    user_id: profile.id,
    full_name: fullName,
    address_line1: addressLine1,
    address_line2: addressLine2 || null,
    ...rest,
  });

  if (error) {
    return { message: "Something went wrong. Please try again." };
  }

  return { success: true };
}