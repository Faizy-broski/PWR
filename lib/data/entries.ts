import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/dal";
import { mapCompetition } from "@/lib/data/competitions";
import type { Entry, Transaction } from "@/lib/types";

// The signed-in user's entries, keyed by competition_id (each user gets at
// most one entry per competition — see purchase_entry() in
// supabase/migrations/20260818000002_one_entry_per_user.sql). One query
// covers every competition on the page, so callers rendering a list of
// competition cards can look up "have I entered this one?" via .has()
// instead of querying per card. Returns an empty map for signed-out
// visitors.
export async function getMyEntryMap(): Promise<
  Map<string, { id: string; ticketNumbers: number[] }>
> {
  const profile = await getCurrentUser();
  if (!profile) return new Map();

  const supabase = await createClient();
  const { data } = await supabase
    .from("entries")
    .select("id, competition_id, ticket_numbers");

  return new Map(
    (data ?? []).map((row) => [
      row.competition_id,
      { id: row.id, ticketNumbers: row.ticket_numbers },
    ]),
  );
}

// PWR Diamond and PWR Black Diamond are gated: a user must already hold at
// least one *paid* entry (any competition with a real ticket price, not a
// free one like PWR Diamond itself) before their free spot on either page
// unlocks. Signed-out visitors are never unlocked.
export async function hasPaidEntry(): Promise<boolean> {
  const profile = await getCurrentUser();
  if (!profile) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("id")
    .eq("status", "paid")
    .gt("amount", 0)
    .limit(1);

  if (error) throw error;
  return (data ?? []).length > 0;
}

// Whether the signed-in user has already submitted their PWR Black Diamond
// guaranteed-win claim (see prize_claims — one per user).
export async function getMyPrizeClaim() {
  const profile = await getCurrentUser();
  if (!profile) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prize_claims")
    .select("id")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

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

// Admin: every transaction across all users, joined with the buyer's email,
// name, and the ticket number(s) of the entry it produced (if any — failed
// or pending transactions have none).
export async function getAllTransactions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "*, competitions(*), profiles(email, full_name), entries(ticket_numbers)",
    )
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
    customerName: row.profiles?.full_name ?? null,
    ticketNumbers: row.entries?.[0]?.ticket_numbers ?? null,
  }));
}
