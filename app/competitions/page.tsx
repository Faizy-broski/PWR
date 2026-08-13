import type { Metadata } from "next";
import { CompetitionsCatalog } from "@/components/landing/competitions/competitions-catalog";

export const metadata: Metadata = {
  title: "All Competitions | PWR",
  description:
    "Every live PWR competition, filterable by category, drawn transparently when it closes.",
};

export default function CompetitionsPage() {
  return <CompetitionsCatalog />;
}
