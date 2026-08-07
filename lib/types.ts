export type CompetitionStatus = "draft" | "live" | "closed" | "drawn";

export interface Competition {
  id: string;
  slug: string;
  title: string;
  description: string;
  prizeValue: number;
  ticketPrice: number;
  totalTickets: number;
  ticketsSold: number;
  status: CompetitionStatus;
  images: string[];
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
