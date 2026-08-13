"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { createServiceClient } from "@/lib/supabase/service";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export type CheckoutFormState =
  | {
      error?: string;
    }
  | undefined;

const CheckoutSchema = z.object({
  competitionId: z.string().uuid(),
  slug: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  answerCorrect: z.coerce.boolean(),
});

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

// Creates a pending transaction, then hands off to Stripe Checkout for
// actual payment collection. Ticket allocation happens only after Stripe
// confirms the charge — via the webhook (app/api/webhooks/stripe/route.ts)
// as the source of truth, with the competition detail page's success
// handler as a fallback in case the webhook hasn't landed yet (both call
// the same idempotent finalizeStripeSession()).
export async function purchaseTickets(
  _state: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const profile = await requireUser();

  if (!isStripeConfigured()) {
    return {
      error:
        "Payments aren't configured yet. Set STRIPE_SECRET_KEY to enable checkout.",
    };
  }

  const validated = CheckoutSchema.safeParse({
    competitionId: formData.get("competitionId"),
    slug: formData.get("slug"),
    quantity: formData.get("quantity"),
    answerCorrect: formData.get("answerCorrect"),
  });

  if (!validated.success) {
    return { error: "Invalid checkout details." };
  }

  const { competitionId, slug, quantity, answerCorrect } = validated.data;

  if (!answerCorrect) {
    return { error: "That's not the right answer to the skill question." };
  }

  // Service role: transactions/entries/tickets are written server-side only
  // (see supabase/migrations/20260807000003_rls_policies.sql).
  const supabase = createServiceClient();

  const { data: competition, error: competitionError } = await supabase
    .from("competitions")
    .select("id, title, ticket_price, status, starts_at")
    .eq("id", competitionId)
    .single();

  if (competitionError || !competition) {
    return { error: "Competition not found." };
  }

  if (competition.status !== "live") {
    return { error: "This competition is no longer open for entries." };
  }

  if (new Date(competition.starts_at) > new Date()) {
    return { error: "This competition hasn't started yet." };
  }

  const amount = Number(competition.ticket_price) * quantity;

  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .insert({
      user_id: profile.id,
      competition_id: competitionId,
      amount,
      status: "pending",
    })
    .select("id")
    .single();

  if (transactionError || !transaction) {
    return { error: "Could not start checkout. Please try again." };
  }

  const stripe = getStripe();
  let checkoutUrl: string | null;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: transaction.id,
      customer_email: profile.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `${competition.title} — ${quantity} ticket${quantity > 1 ? "s" : ""}`,
            },
          },
        },
      ],
      metadata: {
        transactionId: transaction.id,
        competitionId,
        quantity: String(quantity),
        answerCorrect: String(answerCorrect),
      },
      success_url: `${siteUrl()}/competitions/${slug}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/competitions/${slug}/checkout?canceled=1`,
    });
    checkoutUrl = session.url;
  } catch {
    await supabase
      .from("transactions")
      .update({ status: "failed" })
      .eq("id", transaction.id);
    return { error: "Could not start payment. Please try again." };
  }

  if (!checkoutUrl) {
    return { error: "Could not start payment. Please try again." };
  }

  redirect(checkoutUrl);
}
