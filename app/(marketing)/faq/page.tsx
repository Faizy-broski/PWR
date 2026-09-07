import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "FAQs" };

const faqs = [
  {
    q: "How do I enter a competition?",
    d: "Choose a competition, answer the skill question, complete checkout (or use the free postal entry route where available) and you'll receive your ticket number(s) by email.",
  },
  {
    q: "How are winners chosen?",
    d: "Winners are selected by random draw across all valid paid and free postal entries once a competition closes.",
  },
  {
    q: "Is there a free way to enter?",
    d: "Yes — PWR paid competitions offer a free postal entry route with equal chance of winning. Details for the specific competition are on its entry page.",
  },
  {
    q: "How will I be notified if I win?",
    d: "Winners are contacted using the details provided at entry.",
  },
];

export default function FaqPage() {
  return (
    <LegalPage title="FAQs">
      <p>
        Placeholder FAQ content — to be reviewed and finalised alongside the
        rest of PWR&apos;s legal and operational copy.
      </p>
      {faqs.map((item) => (
        <div key={item.q}>
          <h2>{item.q}</h2>
          <p>{item.d}</p>
        </div>
      ))}
    </LegalPage>
  );
}
