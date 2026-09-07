import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CommunitySection } from "@/components/pages/about/community-section";

export const metadata: Metadata = {
  title: "Community",
  description:
    "5% of every paid PWR competition ticket goes towards community initiatives — here's how it works.",
};

const pillars = [
  {
    title: "5% Of Every Paid Ticket",
    description:
      "A fixed share of paid competition ticket sales is set aside for community initiatives, tracked separately from prize funding and operating costs.",
  },
  {
    title: "Where Support Goes",
    description:
      "Grassroots causes, local charities and community projects nominated and reviewed by the PWR team.",
  },
  {
    title: "Get Involved",
    description:
      "Members will be able to nominate causes and follow along as contributions are put to work.",
  },
  {
    title: "Impact & Evidence",
    description:
      "As initiatives are funded, PWR will publish updates here showing where the money went and what it achieved.",
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#0D0C0C] -mt-18 pt-32 sm:-mt-20 sm:pt-36 lg:-mt-24 lg:pt-40">
      <section className="container pb-16 sm:pb-20">
        <div className="mx-auto mb-10 flex max-w-2xl items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 sm:mb-14">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            <strong>Placeholder copy.</strong> This page is holding a spot in
            navigation until PWR provides final Community page content.
          </p>
        </div>

        <Reveal duration={0.5}>
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-brand-gold-dark" aria-hidden />
              <p className="text-[11px] font-semibold tracking-[0.25em] text-brand-gold-light uppercase">
                Community
              </p>
              <span className="h-px w-6 bg-brand-gold-dark" aria-hidden />
            </div>
            <h1 className="mt-4 text-3xl leading-[1.1] font-extrabold text-white uppercase sm:text-4xl lg:text-5xl">
              Winning That
              <br />
              <span className="font-script">Gives Back</span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              PWR commits 5% of paid competition ticket sales towards
              community initiatives. This page will carry PWR&apos;s full
              community story, how the commitment works, and evidence of its
              impact once that content is confirmed.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-base font-bold text-white">
                  {pillar.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {pillar.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CommunitySection
        eyebrow="Our Commitment"
        titleTop="It Started With"
        titleAccent="A Simple Idea"
        heading="PWR Is About People."
        description="Our community is at the heart of everything we do. As PWR grows, so does our ability to support people, create opportunities and contribute to communities."
      />
    </div>
  );
}
