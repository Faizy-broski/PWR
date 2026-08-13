import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Competition Rules" };

export default function RulesPage() {
  return (
    <LegalPage title="Competition Rules">
      <p>
        The skill question, free postal entry route, and draw mechanics that
        apply to every PWR competition (required for prize competitions to
        stay outside UK gambling regulation).
      </p>
      <h2>Skill question</h2>
      <p>
        Every entry — paid or free — must answer a skill-based question
        correctly to qualify for the draw.
      </p>
      <h2>Free postal entry</h2>
      <p>How to enter without payment, and that it carries equal winning odds to a paid ticket.</p>
      <h2>Odds and ticket limits</h2>
      <h2>How winners are chosen and verified</h2>
    </LegalPage>
  );
}
