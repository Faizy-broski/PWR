"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompetitionForm } from "@/components/admin/competition-form";
import type { Competition } from "@/lib/types";

// Rendered by the intercepted (.)new and (.)[id] routes under
// app/admin/competitions/@modal — clicking "New competition" or "Edit" from
// the competitions list opens this over the list instead of navigating to a
// full page. Visiting the URL directly (refresh, shared link) still renders
// the real page at app/admin/competitions/new or /[id].
export function CompetitionModal({
  competition,
  title,
}: {
  competition?: Competition;
  title: string;
}) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent className="no-scrollbar max-h-[85vh] w-full max-w-2xl overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <CompetitionForm
          competition={competition}
          bare
          onCancel={() => router.back()}
        />
      </DialogContent>
    </Dialog>
  );
}
