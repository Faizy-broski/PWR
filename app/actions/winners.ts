"use server";

import { requireAdmin } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export interface WinnerCandidate {
  entryId: string;
  userId: string;
  fullName: string | null;
  email: string;
  ticketNumbers: number[];
}

export type PickCandidateResult =
  | { candidate: WinnerCandidate; error?: undefined }
  | { candidate?: undefined; error: string };

// Picks a random entrant to consider as the winner — no writes at all, so
// clicking "Draw" repeatedly just re-rolls. Only commit_winner() (below,
// called from updateCompetition on Save) actually records anything or
// notifies anyone. See supabase/migrations/20260826000001_draw_candidate_and_commit.sql.
export async function pickCandidate(
  competitionId: string,
): Promise<PickCandidateResult> {
  await requireAdmin();

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("pick_random_entrant", {
    p_competition_id: competitionId,
  });

  if (error) {
    return { error: error.message };
  }

  const row = data?.[0];
  if (!row) {
    return { error: "No entries to draw from" };
  }

  return {
    candidate: {
      entryId: row.entry_id,
      userId: row.user_id,
      fullName: row.full_name,
      email: row.email,
      ticketNumbers: row.ticket_numbers,
    },
  };
}

export type CommitWinnerResult = { error?: string } | undefined;

// Called from updateCompetition() when the form was submitted with a
// candidateEntryId — this is the only place a draw becomes final.
export async function commitWinner(
  competitionId: string,
  entryId: string,
): Promise<CommitWinnerResult> {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.rpc("commit_winner", {
    p_competition_id: competitionId,
    p_entry_id: entryId,
  });

  if (error) {
    return { error: error.message };
  }

  return undefined;
}
