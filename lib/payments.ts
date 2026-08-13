import "server-only";
import type Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";

export type FinalizeResult =
  | { status: "paid"; ticketNumbers: number[] }
  | { status: "pending" }
  | { status: "error"; message: string };

// Confirms a Stripe Checkout Session and allocates tickets. Called from both
// the webhook (source of truth) and the success-page fallback (in case the
// webhook hasn't landed yet by the time the browser redirects back) — safe
// to call twice because purchase_entry() is idempotent per transaction_id.
export async function finalizeStripeSession(
  session: Stripe.Checkout.Session,
): Promise<FinalizeResult> {
  const transactionId = session.client_reference_id;
  if (!transactionId) {
    return { status: "error", message: "Missing transaction reference." };
  }

  if (session.payment_status !== "paid") {
    return { status: "pending" };
  }

  const quantity = Number(session.metadata?.quantity ?? 0);
  const competitionId = session.metadata?.competitionId;
  const answerCorrect = session.metadata?.answerCorrect === "true";

  if (!competitionId || !quantity) {
    return { status: "error", message: "Missing checkout metadata." };
  }

  const supabase = createServiceClient();

  const { error: markPaidError } = await supabase
    .from("transactions")
    .update({
      status: "paid",
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
    })
    .eq("id", transactionId)
    .eq("status", "pending");

  if (markPaidError) {
    return { status: "error", message: markPaidError.message };
  }

  const { data: purchase, error: purchaseError } = await supabase.rpc(
    "purchase_entry",
    {
      p_competition_id: competitionId,
      p_transaction_id: transactionId,
      p_quantity: quantity,
      p_answer_correct: answerCorrect,
    },
  );

  if (purchaseError) {
    return { status: "error", message: purchaseError.message };
  }

  return {
    status: "paid",
    ticketNumbers: purchase?.[0]?.ticket_numbers ?? [],
  };
}
