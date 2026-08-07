import type { Competition } from "@/lib/types";

// Temporary mock data. Replace with Supabase queries once the
// `competitions` table exists (see lib/supabase/server.ts).
export const mockCompetitions: Competition[] = [
  {
    id: "1",
    slug: "porsche-911-gt3",
    title: "Porsche 911 GT3 + £5,000 Cash",
    description:
      "Win a brand-new Porsche 911 GT3 finished in GT Silver, plus £5,000 cash to cover the drive home.",
    prizeValue: 165000,
    ticketPrice: 4.99,
    totalTickets: 45000,
    ticketsSold: 31820,
    status: "live",
    images: ["/window.svg"],
    closesAt: "2026-09-01T18:00:00.000Z",
    drawnAt: null,
    winnerEntryId: null,
    createdAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "2",
    slug: "iphone-17-pro-max-bundle",
    title: "iPhone 17 Pro Max + Tech Bundle",
    description:
      "iPhone 17 Pro Max, MacBook Pro, and a full Apple accessory bundle.",
    prizeValue: 4500,
    ticketPrice: 1.99,
    totalTickets: 12000,
    ticketsSold: 9440,
    status: "live",
    images: ["/window.svg"],
    closesAt: "2026-08-20T18:00:00.000Z",
    drawnAt: null,
    winnerEntryId: null,
    createdAt: "2026-07-15T09:00:00.000Z",
  },
  {
    id: "3",
    slug: "25000-cash-alternative",
    title: "£25,000 Tax-Free Cash",
    description: "Take the cash and spend it however you like.",
    prizeValue: 25000,
    ticketPrice: 2.99,
    totalTickets: 20000,
    ticketsSold: 20000,
    status: "closed",
    images: ["/window.svg"],
    closesAt: "2026-07-28T18:00:00.000Z",
    drawnAt: "2026-07-28T19:00:00.000Z",
    winnerEntryId: "entry_88213",
    createdAt: "2026-06-10T09:00:00.000Z",
  },
];

export function getLiveCompetitions() {
  return mockCompetitions.filter((c) => c.status === "live");
}

export function getCompetitionBySlug(slug: string) {
  return mockCompetitions.find((c) => c.slug === slug);
}
