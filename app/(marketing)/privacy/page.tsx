import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        How PWR collects, uses, and protects your personal data — account
        details, contact information, and payment records — in line with UK
        GDPR.
      </p>
      <h2>What we collect</h2>
      <p>Account details, entries, orders, and payment metadata (not full card numbers — Stripe handles payment data directly).</p>
      <h2>How we use it</h2>
      <p>Running the competitions, contacting winners, and legal/accounting requirements.</p>
      <h2>Third parties</h2>
      <p>Supabase (hosting/database) and Stripe (payments) process data on our behalf.</p>
      <h2>Your rights</h2>
      <p>Access, correction, deletion, and how to exercise them.</p>
      <h2>Contact</h2>
    </LegalPage>
  );
}
