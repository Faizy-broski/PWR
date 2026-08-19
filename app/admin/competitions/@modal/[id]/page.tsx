import { notFound } from "next/navigation";
import { CompetitionModal } from "@/components/admin/competition-modal";
import { getCompetitionById } from "@/lib/data/competitions";

export default async function EditCompetitionModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const competition = await getCompetitionById(id);

  if (!competition) notFound();

  return (
    <CompetitionModal title={competition.title} competition={competition} />
  );
}
