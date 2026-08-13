import { notFound } from "next/navigation";
import { CompetitionForm } from "@/components/admin/competition-form";
import { getCompetitionById } from "@/lib/data/competitions";

export default async function EditCompetitionPage({
  params,
}: PageProps<"/admin/competitions/[id]">) {
  const { id } = await params;
  const competition = await getCompetitionById(id);

  if (!competition) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit competition
        </h1>
        <p className="mt-1 text-muted-foreground">{competition.title}</p>
      </div>
      <CompetitionForm competition={competition} />
    </div>
  );
}
