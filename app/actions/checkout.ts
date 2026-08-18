"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { createServiceClient } from "@/lib/supabase/service";

export type CheckoutFormState =
  | {
      error?: string;
    }
  | undefined;

const CheckoutSchema = z.object({
  competitionId: z.string().uuid(),
  slug: z.string().min(1),
  answerCorrect: z.coerce.boolean(),
});

const ALREADY_ENTERED_MESSAGE = "You've already entered this competition.";

// No payment method is live yet, so entries are free: we skip Stripe
// entirely, record a zero-amount "paid" transaction, and allocate tickets
// immediately via the same purchase_entry() RPC the Stripe webhook would
// otherwise call (see supabase/migrations/20260813000003_purchase_entry.sql).
// Swap this back to a Stripe Checkout redirect once payments are ready.
export async function purchaseTickets(
  _state: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const profile = await requireUser();

  const validated = CheckoutSchema.safeParse({
    competitionId: formData.get("competitionId"),
    slug: formData.get("slug"),
    quantity: formData.get("quantity"),
    answerCorrect: formData.get("answerCorrect"),
  });

  if (!validated.success) {
    return { error: "Invalid checkout details." };
  }

  const { competitionId, slug, answerCorrect } = validated.data;

  if (!answerCorrect) {
    return { error: "That's not the right answer to the skill question." };
  }

  // Service role: transactions/entries/tickets are written server-side only
  // (see supabase/migrations/20260807000003_rls_policies.sql).
  const supabase = createServiceClient();

  const { data: competition, error: competitionError } = await supabase
    .from("competitions")
    .select("id, status, starts_at")
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

  // One ticket per user per competition — checked up front for a fast,
  // friendly error; purchase_entry() also enforces this atomically (see
  // supabase/migrations/20260818000002_one_entry_per_user.sql) as the
  // race-safe source of truth.
  const { data: existingEntry } = await supabase
    .from("entries")
    .select("id")
    .eq("competition_id", competitionId)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existingEntry) {
    return { error: ALREADY_ENTERED_MESSAGE };
  }

  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .insert({
      user_id: profile.id,
      competition_id: competitionId,
      amount: 0,
      status: "paid",
    })
    .select("id")
    .single();

  if (transactionError || !transaction) {
    return { error: "Could not enter this competition. Please try again." };
  }

  const { data: purchase, error: purchaseError } = await supabase.rpc(
    "purchase_entry",
    {
      p_competition_id: competitionId,
      p_transaction_id: transaction.id,
      p_quantity: 1,
      p_answer_correct: answerCorrect,
    },
  );

  if (purchaseError) {
    await supabase
      .from("transactions")
      .update({ status: "failed" })
      .eq("id", transaction.id);
    const error = purchaseError.message.includes("already entered")
      ? ALREADY_ENTERED_MESSAGE
      : "Could not enter this competition. Please try again.";
    return { error };
  }

  const ticketNumbers: number[] = purchase?.[0]?.ticket_numbers ?? [];

  redirect(
    `/competitions/${slug}/entered?tickets=${ticketNumbers.join(",")}`,
  );
}
