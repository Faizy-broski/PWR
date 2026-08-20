"use server";

import { requireUser } from "@/lib/supabase/dal";
import { getMyEntries, getMyTransactions } from "@/lib/data/entries";

// Backs the /account page (entries + orders + profile settings).
export async function getAccountData() {
  await requireUser();
  const [entries, transactions] = await Promise.all([
    getMyEntries(),
    getMyTransactions(),
  ]);
  return { entries, transactions };
}
