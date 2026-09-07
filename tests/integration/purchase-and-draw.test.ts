// Integration tests against a real (local) Supabase Postgres instance —
// exercises purchase_entry(), pick_random_entrant(), commit_winner(),
// search_competition_entrants(), and close_expired_competitions()
// end to end, the way unit tests (which mock nothing here) can't.
//
// Requires Docker + the Supabase CLI. Not run as part of `pnpm test` (see
// the `tests/integration/**` exclude in vitest.config.ts) because it needs
// a live database. To run:
//
//   supabase start
//   pnpm test:integration
//
// Uses the local dev service-role key that `supabase start` prints (and
// which is the same fixed value for every local Supabase project) —
// never point this at a hosted/production project, since it creates and
// deletes real rows.

import { afterAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtZGVtbyIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxNzk5NTM1NjAwfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createTestUser(email: string) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    password: "test-password-123!",
  });
  if (error || !data.user) throw error ?? new Error("createUser failed");
  return data.user.id;
}

async function createCompetition(overrides: Record<string, unknown> = {}) {
  const { data, error } = await supabase
    .from("competitions")
    .insert({
      slug: `test-${crypto.randomUUID()}`,
      title: "Integration Test Competition",
      prize_value: 100,
      ticket_price: 0,
      total_tickets: 3,
      status: "live",
      starts_at: new Date(Date.now() - 60_000).toISOString(),
      closes_at: new Date(Date.now() + 60_000).toISOString(),
      ...overrides,
    })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("createCompetition failed");
  return data.id as string;
}

async function payAndEnter(competitionId: string, userId: string, quantity = 1) {
  const { data: txn, error: txnError } = await supabase
    .from("transactions")
    .insert({ user_id: userId, competition_id: competitionId, amount: 0, status: "paid" })
    .select("id")
    .single();
  if (txnError || !txn) throw txnError ?? new Error("transaction insert failed");

  return supabase.rpc("purchase_entry", {
    p_competition_id: competitionId,
    p_transaction_id: txn.id,
    p_quantity: quantity,
    p_answer_correct: true,
  });
}

const createdCompetitionIds: string[] = [];
const createdUserIds: string[] = [];

afterAll(async () => {
  for (const id of createdCompetitionIds) {
    await supabase.from("competitions").delete().eq("id", id);
  }
  for (const id of createdUserIds) {
    await supabase.auth.admin.deleteUser(id);
  }
});

describe("purchase_entry", () => {
  it("prevents a second entry from the same user in the same competition", async () => {
    const userId = await createTestUser(`buyer-${crypto.randomUUID()}@example.com`);
    createdUserIds.push(userId);
    const competitionId = await createCompetition();
    createdCompetitionIds.push(competitionId);

    const first = await payAndEnter(competitionId, userId);
    expect(first.error).toBeNull();

    const second = await payAndEnter(competitionId, userId);
    expect(second.error?.message).toContain("already entered");
  });

  it("refuses to oversell beyond total_tickets", async () => {
    const competitionId = await createCompetition({ total_tickets: 1 });
    createdCompetitionIds.push(competitionId);

    const buyerA = await createTestUser(`buyer-${crypto.randomUUID()}@example.com`);
    const buyerB = await createTestUser(`buyer-${crypto.randomUUID()}@example.com`);
    createdUserIds.push(buyerA, buyerB);

    const first = await payAndEnter(competitionId, buyerA, 1);
    expect(first.error).toBeNull();

    const second = await payAndEnter(competitionId, buyerB, 1);
    expect(second.error?.message).toContain("Not enough tickets remaining");
  });
});

describe("pick_random_entrant / commit_winner", () => {
  it("pick_random_entrant refuses when there are no entries, and writes nothing", async () => {
    const competitionId = await createCompetition({ status: "closed" });
    createdCompetitionIds.push(competitionId);

    const { error } = await supabase.rpc("pick_random_entrant", {
      p_competition_id: competitionId,
    });
    expect(error?.message).toContain("No entries to draw from");
  });

  it("pick_random_entrant can be called repeatedly without writing anything", async () => {
    const competitionId = await createCompetition({ status: "live" });
    createdCompetitionIds.push(competitionId);
    const userId = await createTestUser(`buyer-${crypto.randomUUID()}@example.com`);
    createdUserIds.push(userId);
    await payAndEnter(competitionId, userId);
    await supabase.from("competitions").update({ status: "closed" }).eq("id", competitionId);

    for (let i = 0; i < 3; i++) {
      const { data, error } = await supabase.rpc("pick_random_entrant", {
        p_competition_id: competitionId,
      });
      expect(error).toBeNull();
      expect(data?.[0]?.user_id).toBe(userId);
    }

    const { data: competition } = await supabase
      .from("competitions")
      .select("status, drawn_at, winner_entry_id")
      .eq("id", competitionId)
      .single();
    expect(competition?.status).toBe("closed");
    expect(competition?.drawn_at).toBeNull();
    expect(competition?.winner_entry_id).toBeNull();
  });

  it("commit_winner records the winner, sets drawn_at/status, and refuses a second commit", async () => {
    const competitionId = await createCompetition({ status: "live" });
    createdCompetitionIds.push(competitionId);
    const userId = await createTestUser(`buyer-${crypto.randomUUID()}@example.com`);
    createdUserIds.push(userId);

    const { data: purchase, error: entryError } = await payAndEnter(competitionId, userId);
    expect(entryError).toBeNull();
    const entryId = purchase?.[0]?.entry_id as string;

    await supabase.from("competitions").update({ status: "closed" }).eq("id", competitionId);

    const { data, error } = await supabase.rpc("commit_winner", {
      p_competition_id: competitionId,
      p_entry_id: entryId,
    });
    expect(error).toBeNull();
    expect(data?.[0]?.winner_user_id).toBe(userId);

    const { data: competition } = await supabase
      .from("competitions")
      .select("status, drawn_at, winner_entry_id")
      .eq("id", competitionId)
      .single();
    expect(competition?.status).toBe("drawn");
    expect(competition?.drawn_at).not.toBeNull();

    const { error: secondCommitError } = await supabase.rpc("commit_winner", {
      p_competition_id: competitionId,
      p_entry_id: entryId,
    });
    expect(secondCommitError?.message).toContain("already has a winner");
  });

  it("commit_winner rejects an entry_id that doesn't belong to the competition", async () => {
    const competitionA = await createCompetition({ status: "live" });
    const competitionB = await createCompetition({ status: "closed" });
    createdCompetitionIds.push(competitionA, competitionB);
    const userId = await createTestUser(`buyer-${crypto.randomUUID()}@example.com`);
    createdUserIds.push(userId);

    const { data: purchase } = await payAndEnter(competitionA, userId);
    const entryFromOtherCompetition = purchase?.[0]?.entry_id as string;

    const { error } = await supabase.rpc("commit_winner", {
      p_competition_id: competitionB,
      p_entry_id: entryFromOtherCompetition,
    });
    expect(error?.message).toContain("no longer belongs to this competition");
  });

  it("fans out entry_confirmed and you_won notifications to the right users", async () => {
    const competitionId = await createCompetition({ status: "live" });
    createdCompetitionIds.push(competitionId);
    const userId = await createTestUser(`buyer-${crypto.randomUUID()}@example.com`);
    createdUserIds.push(userId);

    const { data: purchase } = await payAndEnter(competitionId, userId);
    const entryId = purchase?.[0]?.entry_id as string;

    const { data: confirmed } = await supabase
      .from("notifications")
      .select("type")
      .eq("user_id", userId)
      .eq("competition_id", competitionId)
      .eq("type", "entry_confirmed");
    expect(confirmed?.length).toBe(1);

    await supabase.from("competitions").update({ status: "closed" }).eq("id", competitionId);
    await supabase.rpc("commit_winner", {
      p_competition_id: competitionId,
      p_entry_id: entryId,
    });

    const { data: won } = await supabase
      .from("notifications")
      .select("type")
      .eq("user_id", userId)
      .eq("competition_id", competitionId)
      .eq("type", "you_won");
    expect(won?.length).toBe(1);
  });
});

describe("search_competition_entrants", () => {
  it("paginates and searches by name/email", async () => {
    const competitionId = await createCompetition({ status: "live" });
    createdCompetitionIds.push(competitionId);
    const email = `findme-${crypto.randomUUID()}@example.com`;
    const userId = await createTestUser(email);
    createdUserIds.push(userId);
    await payAndEnter(competitionId, userId);

    const { data: all, error } = await supabase.rpc("search_competition_entrants", {
      p_competition_id: competitionId,
      p_search: "",
      p_page: 1,
      p_page_size: 10,
    });
    expect(error).toBeNull();
    expect(all?.length).toBe(1);
    expect(all?.[0]?.total_count).toBe(1);

    const { data: matched } = await supabase.rpc("search_competition_entrants", {
      p_competition_id: competitionId,
      p_search: email.slice(0, 7),
      p_page: 1,
      p_page_size: 10,
    });
    expect(matched?.length).toBe(1);

    const { data: unmatched } = await supabase.rpc("search_competition_entrants", {
      p_competition_id: competitionId,
      p_search: "definitely-not-a-match",
      p_page: 1,
      p_page_size: 10,
    });
    expect(unmatched?.length).toBe(0);
  });
});

describe("close_expired_competitions", () => {
  it("closes live competitions whose closes_at has passed, leaves others alone", async () => {
    const expired = await createCompetition({
      status: "live",
      closes_at: new Date(Date.now() - 1000).toISOString(),
    });
    const stillOpen = await createCompetition({
      status: "live",
      closes_at: new Date(Date.now() + 60_000).toISOString(),
    });
    createdCompetitionIds.push(expired, stillOpen);

    await supabase.rpc("close_expired_competitions");

    const { data } = await supabase
      .from("competitions")
      .select("id, status")
      .in("id", [expired, stillOpen]);

    expect(data?.find((c) => c.id === expired)?.status).toBe("closed");
    expect(data?.find((c) => c.id === stillOpen)?.status).toBe("live");
  });
});
