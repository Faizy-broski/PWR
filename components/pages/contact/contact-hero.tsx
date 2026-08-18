"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { Magnetic } from "@/components/motion/magnetic";

interface ContactStatItem {
  icon: string;
  value: string;
  label: string;
}

export interface ContactOption {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

const defaultStats: ContactStatItem[] = [
  { icon: "/svg's/trophy.svg", value: "Over 833k+", label: "Winners" },
  { icon: "/svg's/star.svg", value: "26 Years", label: "UK's No.1" },
  { icon: "/svg's/gift.svg", value: "£166M+", label: "In Prize Won" },
];

const defaultOptions: ContactOption[] = [
  {
    icon: "/svg's/help.svg",
    title: "General Enquiries",
    description: "Questions about PWR, competitions or your account.",
    ctaLabel: "Contact",
    ctaHref: "/contact/general",
  },
  {
    icon: "/svg's/support.svg",
    title: "Customer Support",
    description: "Need help with an entry or your account?",
    ctaLabel: "Contact",
    ctaHref: "/contact/support",
  },
  {
    icon: "/svg's/trophy-outline.svg",
    title: "Winner Support",
    description: "Already won? Get in touch with our team.",
    ctaLabel: "Contact",
    ctaHref: "/contact/winners",
  },
];

function ContactOptionCard({
  option,
  className,
}: {
  option: ContactOption;
  className?: string;
}) {
  return (
    <div className={cn("p-8 sm:p-10", className)}>
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-brand-gradient" aria-hidden />
        <img src={option.icon} alt="" className="size-5" />
      </div>

      <h3 className="mt-5 text-sm font-extrabold tracking-wide text-[#0D0C0C] uppercase">
        {option.title}
      </h3>

      <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-black/45">
        {option.description}
      </p>

      <Magnetic strength={0.25} className="mt-5 inline-block">
        <Link
          href={option.ctaHref}
          className="group inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-[#0D0C0C] uppercase transition-colors hover:text-brand-gold-dark"
        >
          {option.ctaLabel}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Magnetic>
    </div>
  );
}

export function ContactHero({
  eyebrow = "Contact Us",
  titleTop = "We're here to",
  titleAccent = "Help",
  stats = defaultStats,
  options = defaultOptions,
}: {
  eyebrow?: string;
  titleTop?: string;
  titleAccent?: string;
  stats?: ContactStatItem[];
  options?: ContactOption[];
}) {
  return (
    <div className="container">
      <div className="text-center">
        <Reveal duration={0.5}>
          <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-brand-gradient uppercase">
            {eyebrow}
          </p>
        </Reveal>

        <h1 className="text-4xl leading-[1.1] font-extrabold text-white uppercase sm:text-5xl lg:text-6xl">
          <TextReveal text={titleTop} delay={0.1} />{" "}
          <motion.span
            className="font-script inline-block"
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {titleAccent}
          </motion.span>
        </h1>

        <RevealGroup className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10">
          {stats.map(({ icon, value, label }, i) => (
            <RevealItem key={label} className="flex items-center gap-8 sm:gap-10">
              <div className="flex items-center gap-8 sm:gap-10">
                {i > 0 ? (
                  <span
                    aria-hidden
                    className="hidden h-8 w-px bg-white/10 sm:block"
                  />
                ) : null}
                <div className="flex items-center gap-2.5">
                  <img src={icon} alt="" className="size-8" />
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-sm text-white sm:text-[16px]">
                      {value}
                    </span>
                    <span className="text-[11px] font-medium tracking-wide text-white uppercase">
                      {label}
                    </span>
                  </span>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <RevealGroup className="relative z-10 mt-10 grid grid-cols-1 divide-y divide-black/5 rounded-3xl bg-white sm:mt-12 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:shadow-2xl">
        {options.map((option) => (
          <RevealItem key={option.title}>
            <ContactOptionCard option={option} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
