import { notFound } from "next/navigation";
import { CompetitionModal } from "@/components/admin/competition-modal";
import { getCompetitionById } from "@/lib/data/competitions";
import { getWinnerEntry } from "@/lib/data/entrants";

export default async function EditCompetitionModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const competition = await getCompetitionById(id);

  if (!competition) notFound();

  const winner = competition.winnerEntryId
    ? await getWinnerEntry(competition.winnerEntryId, competition.drawnAt)
    : null;

  return (
    <CompetitionModal
      title={competition.title}
      competition={competition}
      winner={winner}
    />
  );
}
