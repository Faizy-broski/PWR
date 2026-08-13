import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy">
      <p>What cookies PWR sets and why.</p>
      <h2>Essential cookies</h2>
      <p>
        Session cookies from Supabase Auth, required to keep you signed in —
        these can&apos;t be disabled without breaking login.
      </p>
      <h2>Analytics / marketing</h2>
      <p>Not currently in use — update this section if that changes.</p>
    </LegalPage>
  );
}
