import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Countdown } from "@/components/landing/competitions/countdown";
import { CompetitionGallery } from "@/components/landing/competitions/competition-gallery";
import { PaymentPendingNotice } from "@/components/checkout/payment-pending-notice";
import { getCompetitionBySlug, mapCompetition } from "@/lib/data/competitions";
import { COMPETITION_CATEGORY_LABELS } from "@/lib/types";
import { createServiceClient } from "@/lib/supabase/service";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { finalizeStripeSession, type FinalizeResult } from "@/lib/payments";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export async function generateStaticParams() {
  // Runs at build time with no request context, so it can't use the
  // cookie-based server client (see lib/supabase/server.ts).
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("competitions")
    .select("*")
    .eq("status", "live")
    .lte("starts_at", new Date().toISOString());

  return (data ?? []).map(mapCompetition).map((c) => ({ slug: c.slug }));
}

export default async function CompetitionDetailPage({
  params,
  searchParams,
}: PageProps<"/competitions/[slug]">) {
  const { slug } = await params;
  const { entered, tickets, session_id } = await searchParams;
  const competition = await getCompetitionBySlug(slug);

  if (!competition) notFound();

  // Fallback confirmation path: normally the Stripe webhook allocates
  // tickets before the browser even gets here, but if it hasn't landed yet
  // we confirm the session ourselves — safe to do twice, see
  // lib/payments.ts.
  let paymentResult: FinalizeResult | null = null;
  if (typeof session_id === "string" && session_id && isStripeConfigured()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      paymentResult = await finalizeStripeSession(session);
    } catch {
      paymentResult = {
        status: "error",
        message: "We couldn't confirm your payment.",
      };
    }
  }

  if (paymentResult?.status === "paid") {
    redirect(
      `/competitions/${slug}?entered=success&tickets=${paymentResult.ticketNumbers.join(",")}`,
    );
  }

  const ticketNumbers =
    entered === "success" && typeof tickets === "string" && tickets.length > 0
      ? tickets.split(",")
      : null;

  const percentSold = Math.min(
    100,
    Math.round((competition.ticketsSold / competition.totalTickets) * 100),
  );
  const ticketsLeft = competition.totalTickets - competition.ticketsSold;
  const hasStarted = new Date(competition.startsAt) <= new Date();
  const isLive = competition.status === "live";
  const isOpenForEntry = isLive && hasStarted;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      {ticketNumbers && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium">You&apos;re in! Good luck.</p>
            <p className="text-sm text-muted-foreground">
              Your ticket number{ticketNumbers.length > 1 ? "s" : ""}:{" "}
              {ticketNumbers.join(", ")}. Find this order any time in your
              account (tap the avatar in the navbar).
            </p>
          </div>
        </div>
      )}

      {paymentResult?.status === "pending" && <PaymentPendingNotice />}

      {paymentResult?.status === "error" && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium">We couldn&apos;t confirm your payment</p>
            <p className="text-sm text-muted-foreground">
              If you were charged, check your account in a moment — it may
              still be processing. Contact support if it doesn&apos;t appear.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-2">
        <CompetitionGallery
          images={competition.images}
          title={competition.title}
          badge={
            <Badge
              className="absolute left-4 top-4"
              variant={isOpenForEntry ? "default" : "secondary"}
            >
              {isOpenForEntry ? "Live" : isLive ? "Starts soon" : "Closed"}
            </Badge>
          }
        />

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {COMPETITION_CATEGORY_LABELS[competition.category]}
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight">
              {competition.title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {competition.description}
            </p>
          </div>

          {isLive && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {hasStarted ? "Closes in" : "Starts in"}
              </span>
              <Countdown
                closesAt={hasStarted ? competition.closesAt : competition.startsAt}
              />
            </div>
          )}

          <div className="space-y-2 rounded-xl border border-border bg-card p-4">
            <Progress value={percentSold} />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{percentSold}% sold</span>
              <span>{ticketsLeft.toLocaleString()} tickets left</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <p className="text-sm text-muted-foreground">Ticket price</p>
              <p className="text-2xl font-semibold">
                {formatGBP(competition.ticketPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Prize value</p>
              <p className="text-2xl font-semibold">
                {formatGBP(competition.prizeValue)}
              </p>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={!isOpenForEntry}
            render={
              isOpenForEntry ? (
                <Link href={`/competitions/${competition.slug}/checkout`} />
              ) : undefined
            }
          >
            {isOpenForEntry
              ? "Enter Now"
              : isLive
                ? "Starts Soon"
                : "Competition Closed"}
          </Button>

          <p className="text-xs text-muted-foreground">
            Free postal entry available.{" "}
            <Link href="/free-entry" className="underline underline-offset-2">
              See details
            </Link>
            . 18+ UK residents only.
          </p>
        </div>
      </div>
    </div>
  );
}
