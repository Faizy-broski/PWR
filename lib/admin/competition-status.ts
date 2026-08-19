import type { Competition } from "@/lib/types";

// "Sold out" isn't a status we store — it's derived from real ticket counts
// on an otherwise-live competition, not a fabricated state.
export function competitionStatusPill(competition: Competition) {
  if (competition.status === "live") {
    return competition.ticketsSold >= competition.totalTickets
      ? { tone: "dark" as const, label: "Sold out" }
      : { tone: "warm" as const, label: "Live" };
  }
  if (competition.status === "draft")
    return { tone: "muted" as const, label: "Draft" };
  if (competition.status === "closed")
    return { tone: "dark" as const, label: "Closed" };
  return { tone: "dark" as const, label: "Drawn" };
}

export function formatCountdown(closesAt: string) {
  const diff = new Date(closesAt).getTime() - Date.now();
  if (diff <= 0) return "—";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days}D ${hours}H`;
}
