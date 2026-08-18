import { Mail, Phone, MapPin, Clock, type LucideIcon } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { LineDraw } from "@/components/motion/line-draw";
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
          <div>
            <Reveal duration={0.5}>
              <h2 className="text-2xl font-extrabold text-white uppercase sm:text-3xl">
                {title}
              </h2>
              <LineDraw className="mt-3" delay={0.3} />

              <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-white/50">
                {description}
              </p>
            </Reveal>

            <RevealGroup className="mt-10 space-y-5">
              {info.map((item) => (
                <RevealItem key={item.label}>
                  <ContactInfoItem item={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
