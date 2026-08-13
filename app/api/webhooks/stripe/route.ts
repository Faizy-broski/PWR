import { NextResponse, type NextRequest } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { finalizeStripeSession } from "@/lib/payments";

// Stripe webhook: confirms payment and allocates tickets server-to-server,
// independent of whether the customer's browser makes it back to the
// success page. Configure this URL (https://<domain>/api/webhooks/stripe)
// in the Stripe Dashboard, subscribed to "checkout.session.completed", and
// set STRIPE_WEBHOOK_SECRET to the signing secret it gives you.
export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const result = await finalizeStripeSession(session);
    if (result.status === "error") {
      // Non-2xx tells Stripe to retry the webhook.
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
