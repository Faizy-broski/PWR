import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { COMPETITION_CATEGORY_LABELS, type Competition } from "@/lib/types";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function CompetitionBrowseCard({
  competition,
}: {
  competition: Competition;
}) {
  const percentSold = Math.min(
    100,
    Math.round((competition.ticketsSold / competition.totalTickets) * 100),
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={competition.images[0]}
          alt={competition.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3">
          {COMPETITION_CATEGORY_LABELS[competition.category]}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 font-semibold tracking-tight">
          {competition.title}
        </h3>

        <div className="space-y-1.5">
          <Progress value={percentSold} />
          <p className="text-xs text-muted-foreground">
            {percentSold}% sold ·{" "}
            {(competition.totalTickets - competition.ticketsSold).toLocaleString()}{" "}
            left
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <div>
            <p className="text-xs text-muted-foreground">Entry</p>
            <p className="font-semibold">
              {formatGBP(competition.ticketPrice)}
            </p>
          </div>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={`/competitions/${competition.slug}`} />}
          >
            Enter Now
          </Button>
        </div>
      </div>
    </div>
  );
}
