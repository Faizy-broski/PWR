import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { AdminPageHeader } from "@/components/admin/page-header";
import { MotionButton } from "@/components/admin/motion-button";
import { CompetitionsTable } from "@/components/admin/competitions-table";
import { getAllCompetitions } from "@/lib/data/competitions";

export default async function AdminCompetitionsPage() {
  const competitions = await getAllCompetitions();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Competitions"
        description="Create and manage prize competitions."
        action={
          <MotionButton>
            <Button
              nativeButton={false}
              render={<Link href="/admin/competitions/new" />}
            >
              <Plus className="size-4" />
              New competition
            </Button>
          </MotionButton>
        }
      />

      <Reveal delay={0.1}>
        <CompetitionsTable competitions={competitions} />
      </Reveal>
    </div>
  );
}
