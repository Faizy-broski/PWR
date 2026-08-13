import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// Lazily constructed so importing this module doesn't crash pages/builds
// that don't need Stripe when keys aren't set yet — callers should check
// isStripeConfigured() first and surface a clear error instead of a stack
// trace (see purchaseTickets in app/actions/checkout.ts).
export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set — payments are not configured.",
    );
  }
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return client;
}
