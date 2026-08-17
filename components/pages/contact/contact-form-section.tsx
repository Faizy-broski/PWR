import { Mail, Phone, MapPin, Clock, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ContactInfoItem, type ContactInfoItemData } from "./contact-info-item";
import { ContactForm } from "./contact-form";

const defaultInfo: ContactInfoItemData[] = [
  {
    icon: Mail,
    label: "Email",
    value: "support@pwr.today",
    href: "mailto:support@pwr.today",
  },
  { icon: Phone, label: "Phone", value: "[Client To Provide]" },
  { icon: MapPin, label: "Address", value: "[Client To Provide]" },
  { icon: Clock, label: "Opening Hours", value: "[Client To Provide]" },
];

export function ContactFormSection({
  title = "Contact PWR",
  description = "Whether you have a question about a competition, need help with your account or simply want to get in touch, send us a message and our team will get back to you.",
  info = defaultInfo,
}: {
  title?: string;
  description?: string;
  info?: ContactInfoItemData[];
}) {
  return (
    <section className="py-16 sm:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16">
          <Reveal duration={0.5}>
            <div>
              <h2 className="text-2xl font-extrabold text-white uppercase sm:text-3xl">
                {title}
              </h2>
              <span className="mt-3 block h-0.5 w-8 bg-brand-gold-dark" />

              <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-white/50">
                {description}
              </p>

              <div className="mt-10 space-y-5">
                {info.map((item) => (
                  <ContactInfoItem key={item.label} item={item} />
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}