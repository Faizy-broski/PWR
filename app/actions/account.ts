"use server";

import { requireUser } from "@/lib/supabase/dal";
import { getMyEntries, getMyTransactions } from "@/lib/data/entries";

// Called directly from the client (Account Sheet) when it opens — entries
// and orders aren't needed on every page load, only when the visitor
// actually opens their account panel.
export async function getAccountData() {
  await requireUser();
  const [entries, transactions] = await Promise.all([
    getMyEntries(),
    getMyTransactions(),
  ]);
  return { entries, transactions };
}
