"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/admin/motion-button";
import { pickCandidate, type WinnerCandidate } from "@/app/actions/winners";
import type { WinnerEntry } from "@/lib/data/entrants";

function ticketList(numbers: number[]) {
  return numbers.map((n) => `#${n}`).join(", ");
}

// Already committed (competition.status === 'drawn') — read-only, no draw
// controls. commit_winner() never lets a second draw happen once this is
// true (see supabase/migrations/20260826000001_draw_candidate_and_commit.sql).
export function CommittedWinner({ winner }: { winner: WinnerEntry }) {
  return (
    <div className="space-y-1 rounded-2xl border border-border bg-muted/30 p-4">
      <p className="text-sm font-semibold">
        Winner: {winner.fullName ?? winner.email}
      </p>
      <p className="text-sm text-muted-foreground">
        Ticket {ticketList(winner.ticketNumbers)}
        {winner.drawnAt &&
          ` · Drawn ${new Date(winner.drawnAt).toLocaleString("en-GB")}`}
      </p>
    </div>
  );
}

// competition.status === 'closed' && no winner yet — the admin can draw and
// re-draw as many candidates as they like here; nothing is written to the
// database until the whole form is saved (candidateEntryId rides along as a
// hidden field — see updateCompetition() in app/actions/competitions.ts).
export function CompetitionDraw({ competitionId }: { competitionId: string }) {
  const [candidate, setCandidate] = useState<WinnerCandidate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function draw() {
    setError(null);
    startTransition(async () => {
      const result = await pickCandidate(competitionId);
      if (result.error) {
        setError(result.error);
        setCandidate(null);
      } else {
        setCandidate(result.candidate ?? null);
      }
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        This competition is closed and hasn&apos;t been drawn yet. Drawing
        here only picks a candidate — nothing is recorded until you save.
      </p>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {candidate && (
        <div className="space-y-1 rounded-2xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-semibold">
            Candidate: {candidate.fullName ?? candidate.email}
          </p>
          <p className="text-sm text-muted-foreground">
            Ticket {ticketList(candidate.ticketNumbers)}
          </p>
          <p className="text-xs text-muted-foreground">
            Not final until you save.
          </p>
        </div>
      )}

      <input type="hidden" name="candidateEntryId" value={candidate?.entryId ?? ""} />

      <MotionButton>
        <Button type="button" variant="outline" disabled={pending} onClick={draw}>
          {pending ? "Drawing…" : candidate ? "Draw again" : "Draw"}
        </Button>
      </MotionButton>
    </div>
  );
}
