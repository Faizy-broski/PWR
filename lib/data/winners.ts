import { createServiceClient } from "@/lib/supabase/service";

export interface Winner {
  name: string;
  location: string;
  prizeLabel: string;
  drawName: string;
  wonAt: string;
}

function formatPrize(prizeValue: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(prizeValue);
}

// Drawn competitions, newest first — replaces what used to be hardcoded
// sample data. profiles has no address/location field today, so location is
// left blank rather than invented.
//
// Uses the service-role client deliberately: this is public marketing
// content (announcing winners by name), but reading the winning entry's
// user requires crossing the RLS "own rows only" boundary on entries/
// profiles the same way checkout's purchase_entry() does — there is no anon
// read policy on those tables, so the regular cookie-scoped client would
// return null names for anonymous visitors.
export async function getWinners(): Promise<Winner[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("competitions")
    .select(
      "title, prize_value, drawn_at, entries!competitions_winner_entry_id_fkey(profiles(full_name, email))",
    )
    .eq("status", "drawn")
    .not("winner_entry_id", "is", null)
    .order("drawn_at", { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .filter((row) => row.drawn_at)
    .map((row) => {
      const winnerProfile = row.entries?.profiles;
      return {
        name: winnerProfile?.full_name ?? winnerProfile?.email ?? "Winner",
        location: "",
        prizeLabel: formatPrize(Number(row.prize_value)),
        drawName: row.title,
        wonAt: row.drawn_at as string,
      };
    });
}
