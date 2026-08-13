import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>
        These terms govern entry into PWR prize competitions, including
        ticket purchases, the free postal entry route, eligibility, and how
        winners are drawn and notified.
      </p>
      <h2>Eligibility</h2>
      <p>Who can enter (age, location) and any per-person entry limits.</p>
      <h2>Entries and tickets</h2>
      <p>
        How paid entries and free postal entries are treated equally in the
        draw, and how ticket numbers are allocated.
      </p>
      <h2>The draw</h2>
      <p>How and when winners are selected, and how they&apos;re notified.</p>
      <h2>Prizes</h2>
      <p>Delivery, cash-alternative options, and any conditions on claiming.</p>
      <h2>Cancellations and refunds</h2>
      <h2>Contact</h2>
    </LegalPage>
  );
}
