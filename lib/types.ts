export type CompetitionStatus = "draft" | "live" | "closed" | "drawn";

export type CompetitionCategory = "free" | "gold" | "platinum" | "vip";

export const COMPETITION_CATEGORIES: CompetitionCategory[] = [
  "free",
  "gold",
  "platinum",
  "vip",
];

export const COMPETITION_CATEGORY_LABELS: Record<CompetitionCategory, string> = {
  free: "PWR Free",
  gold: "PWR Gold",
  platinum: "PWR Platinum",
  vip: "PWR VIP",
};

export interface Competition {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CompetitionCategory;
  prizeValue: number;
  ticketPrice: number;
  totalTickets: number;
  ticketsSold: number;
  status: CompetitionStatus;
  images: string[];
  startsAt: string;
  closesAt: string;
  drawnAt: string | null;
  winnerEntryId: string | null;
  createdAt: string;
}

export interface Ticket {
  id: string;
  competitionId: string;
  number: number;
  entryId: string | null;
}

export interface Entry {
  id: string;
  competitionId: string;
  userId: string;
  ticketNumbers: number[];
  answerCorrect: boolean;
  transactionId: string;
  createdAt: string;
}

export type TransactionStatus = "pending" | "paid" | "failed" | "refunded";

export interface Transaction {
  id: string;
  userId: string;
  competitionId: string;
  amount: number;
  currency: "GBP";
  status: TransactionStatus;
  stripePaymentIntentId: string | null;
  createdAt: string;
}

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  isAdmin: boolean;
  createdAt: string;
}
