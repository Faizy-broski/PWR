import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { COMPETITION_CATEGORY_LABELS, type Competition } from "@/lib/types";
import type { FeaturedCompetition } from "@/components/pages/competitions/featured-competition-card";

type CompetitionRow = Database["public"]["Tables"]["competitions"]["Row"];

export function mapCompetition(row: CompetitionRow): Competition {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    prizeValue: Number(row.prize_value),
    ticketPrice: Number(row.ticket_price),
    totalTickets: row.total_tickets,
    ticketsSold: row.tickets_sold,
    status: row.status,
    images: row.images.length > 0 ? row.images : ["/window.svg"],
    startsAt: row.starts_at,
    closesAt: row.closes_at,
    drawnAt: row.drawn_at,
    winnerEntryId: row.winner_entry_id,
    createdAt: row.created_at,
  };
}

// Public listing: only competitions that are live AND whose start time has
// already passed — a competition can be marked 'live' ahead of time with a
// future starts_at to schedule it, and it simply won't be fetched here
// until that moment. Respects RLS (drafts hidden unless the caller is an
// admin) as a second layer.
export async function getLiveCompetitions(): Promise<Competition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("status", "live")
    .lte("starts_at", new Date().toISOString())
    .order("closes_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapCompetition);
}

export async function getCompetitionBySlug(
  slug: string,
): Promise<Competition | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCompetition(data) : null;
}

export async function getCompetitionById(
  id: string,
): Promise<Competition | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCompetition(data) : null;
}

// Adapts a real Competition into the shape the marketing catalog's card
// components expect (they were originally built against curated showcase
// data — see components/landing/competitions/featured-competition-card.tsx).
export function toFeaturedCompetition(c: Competition): FeaturedCompetition {
  const ticketsLeft = c.totalTickets - c.ticketsSold;
  return {
    slug: c.slug,
    title: c.title,
    image: c.images[0],
    category: COMPETITION_CATEGORY_LABELS[c.category],
    prizeValue: c.prizeValue,
    ticketPrice: c.ticketPrice,
    closesAt: c.closesAt,
    startsAt: c.startsAt,
    percentEntered: Math.min(
      100,
      Math.round((c.ticketsSold / c.totalTickets) * 100),
    ),
    ticketsLeft,
    tags: [c.category],
  };
}

// Admin: every competition regardless of status (requires admin RLS access).
export async function getAllCompetitions(): Promise<Competition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapCompetition);
}
