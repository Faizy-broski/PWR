import type { Metadata } from "next";
import { ContactHero } from "@/components/pages/contact/contact-hero";
import { ContactFormSection } from "@/components/pages/contact/contact-form-section";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "",
};

export default async function WinnersPage() {
  return (
    <div className="min-h-screen bg-[#0D0C0C] -mt-18 pt-32 sm:-mt-20 sm:pt-36 lg:-mt-24 lg:pt-40">
      <ContactHero />
      <ContactFormSection />
    </div>
  );
}