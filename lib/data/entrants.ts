import { createClient } from "@/lib/supabase/server";

export interface WinnerEntry {
  entryId: string;
  fullName: string | null;
  email: string;
  ticketNumbers: number[];
  drawnAt: string | null;
}

// Display details for an already-committed winner (competition.status ===
// 'drawn'), used by the read-only winner panel in CompetitionForm. Relies
// on the caller already being admin-gated (this whole route requires
// requireAdmin() — see app/admin/layout.tsx), which is what makes the
// entries/profiles RLS policies ("own row or admin") allow reading another
// user's row here.
export async function getWinnerEntry(
  winnerEntryId: string,
  drawnAt: string | null,
): Promise<WinnerEntry | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select("id, ticket_numbers, profiles(full_name, email)")
    .eq("id", winnerEntryId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    entryId: data.id,
    fullName: data.profiles?.full_name ?? null,
    email: data.profiles?.email ?? "",
    ticketNumbers: data.ticket_numbers,
    drawnAt,
  };
}
