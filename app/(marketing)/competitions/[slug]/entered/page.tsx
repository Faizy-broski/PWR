import { notFound, redirect } from "next/navigation";
import { getCompetitionBySlug } from "@/lib/data/competitions";
import { TicketConfirmation } from "@/components/checkout/ticket-confirmation";

export default async function EnteredPage({
  params,
  searchParams,
}: PageProps<"/competitions/[slug]/entered">) {
  const { slug } = await params;
  const { tickets } = await searchParams;
  const competition = await getCompetitionBySlug(slug);

  if (!competition) notFound();

  const ticketNumbers =
    typeof tickets === "string" && tickets.length > 0 ? tickets.split(",") : [];

  if (ticketNumbers.length === 0) redirect(`/competitions/${slug}`);

  return (
    <div className="dark min-h-screen -mt-18 bg-background pt-18 text-foreground sm:-mt-20 sm:pt-20 lg:-mt-24 lg:pt-24">
      <TicketConfirmation competition={competition} ticketNumbers={ticketNumbers} />
    </div>
  );
}
