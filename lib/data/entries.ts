import { createClient } from "@/lib/supabase/server";
import { mapCompetition } from "@/lib/data/competitions";
import type { Entry, Transaction } from "@/lib/types";

// Entries + the competition they belong to, for the current user (RLS
// scopes this to their own rows automatically).
export async function getMyEntries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    // entries<->competitions has two FKs (entries.competition_id, and
    // competitions.winner_entry_id back to entries), so the embed is
    // ambiguous unless we name which one to follow.
    .select("*, competitions!entries_competition_id_fkey(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    entry: {
      id: row.id,
      competitionId: row.competition_id,
      userId: row.user_id,
      ticketNumbers: row.ticket_numbers,
      answerCorrect: row.answer_correct,
      transactionId: row.transaction_id,
      createdAt: row.created_at,
    } satisfies Entry,
    competition: row.competitions ? mapCompetition(row.competitions) : null,
  }));
}

export async function getMyTransactions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, competitions(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    transaction: {
      id: row.id,
      userId: row.user_id,
      competitionId: row.competition_id,
      amount: Number(row.amount),
      currency: "GBP" as const,
      status: row.status,
      stripePaymentIntentId: row.stripe_payment_intent_id,
      createdAt: row.created_at,
    } satisfies Transaction,
    competition: row.competitions ? mapCompetition(row.competitions) : null,
  }));
}

// Admin: every registered user with their entry count.
export async function getAllUsers() {
  const supabase = await createClient();
  const [{ data: profiles, error: profilesError }, { data: entries, error: entriesError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("entries").select("user_id"),
    ]);

  if (profilesError) throw profilesError;
  if (entriesError) throw entriesError;

  const entryCounts = new Map<string, number>();
  for (const { user_id } of entries ?? []) {
    entryCounts.set(user_id, (entryCounts.get(user_id) ?? 0) + 1);
  }

  return (profiles ?? []).map((profile) => ({
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    isAdmin: profile.is_admin,
    createdAt: profile.created_at,
    entryCount: entryCounts.get(profile.id) ?? 0,
  }));
}

// Admin: every transaction across all users, joined with the buyer's email.
export async function getAllTransactions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, competitions(*), profiles(email)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    transaction: {
      id: row.id,
      userId: row.user_id,
      competitionId: row.competition_id,
      amount: Number(row.amount),
      currency: "GBP" as const,
      status: row.status,
      stripePaymentIntentId: row.stripe_payment_intent_id,
      createdAt: row.created_at,
    } satisfies Transaction,
    competition: row.competitions ? mapCompetition(row.competitions) : null,
    customerEmail: row.profiles?.email ?? "unknown",
  }));
}
