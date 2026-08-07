import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Countdown } from "@/components/competitions/countdown";
import { getCompetitionBySlug, mockCompetitions } from "@/lib/data/competitions";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function generateStaticParams() {
  return mockCompetitions.map((competition) => ({ slug: competition.slug }));
}

export default async function CompetitionDetailPage({
  params,
}: PageProps<"/competitions/[slug]">) {
  const { slug } = await params;
  const competition = getCompetitionBySlug(slug);

  if (!competition) notFound();

  const percentSold = Math.min(
    100,
    Math.round((competition.ticketsSold / competition.totalTickets) * 100),
  );
  const ticketsLeft = competition.totalTickets - competition.ticketsSold;
  const isLive = competition.status === "live";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={competition.images[0]}
            alt={competition.title}
            fill
            className="object-contain p-12"
          />
          <Badge
            className="absolute left-4 top-4"
            variant={isLive ? "default" : "secondary"}
          >
            {isLive ? "Live" : "Closed"}
          </Badge>
        </div>

        <div className="flex flex-col gap-6">
          <div>
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
                Closes in
              </span>
              <Countdown closesAt={competition.closesAt} />
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
            disabled={!isLive}
            render={
              isLive ? (
                <Link href={`/competitions/${competition.slug}/checkout`} />
              ) : undefined
            }
          >
            {isLive ? "Enter Now" : "Competition Closed"}
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
