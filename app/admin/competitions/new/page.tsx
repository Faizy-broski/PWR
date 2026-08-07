import { CompetitionForm } from "@/components/admin/competition-form";

export default function NewCompetitionPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          New competition
        </h1>
        <p className="mt-1 text-muted-foreground">
          Set up a new prize competition.
        </p>
      </div>
      <CompetitionForm />
    </div>
  );
}
