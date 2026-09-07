"use server";

import { requireAdmin } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export interface CompetitionEntrant {
  entryId: string;
  userId: string;
  fullName: string | null;
  email: string;
  ticketNumbers: number[];
  createdAt: string;
}

export interface SearchEntrantsResult {
  entrants: CompetitionEntrant[];
  totalCount: number;
}

const PAGE_SIZE = 10;

// Paginated, searchable entrant list for the admin competition dialog —
// admin-only (exposes other users' names/emails), backed by
// search_competition_entrants() (supabase/migrations/20260826000001_draw_candidate_and_commit.sql).
export async function searchEntrants(
  competitionId: string,
  search: string,
  page: number,
): Promise<SearchEntrantsResult> {
  await requireAdmin();

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_competition_entrants", {
    p_competition_id: competitionId,
    p_search: search,
    p_page: page,
    p_page_size: PAGE_SIZE,
  });

  if (error) throw error;

  return {
    entrants: (data ?? []).map((row) => ({
      entryId: row.entry_id,
      userId: row.user_id,
      fullName: row.full_name,
      email: row.email,
      ticketNumbers: row.ticket_numbers,
      createdAt: row.created_at,
    })),
    totalCount: data?.[0]?.total_count ?? 0,
  };
}

