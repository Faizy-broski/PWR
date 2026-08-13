import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Responsible Play" };

export default function ResponsiblePlayPage() {
  return (
    <LegalPage title="Responsible Play">
      <p>
        PWR competitions are for entertainment. If entering stops being fun,
        here&apos;s where to get support.
      </p>
      <h2>Our commitments</h2>
      <ul>
        <li>18+ only, with age verification on entry.</li>
        <li>Clear ticket limits per competition.</li>
        <li>No credit-based purchases.</li>
      </ul>
      <h2>Support organisations</h2>
      <p>Links to BeGambleAware or equivalent support resources.</p>
    </LegalPage>
  );
}
