import Link from "next/link";
import Image from "next/image";
import type { SVGProps } from "react";
import { NewsletterForm } from "@/components/landing/newsletter-form";
import {
  TestimonialsHeading,
  TestimonialsGrid,
} from "@/components/layout/testimonials";
import { FinalCta } from "@/components/layout/final-cta";

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const columns = [
  {
    title: "Competitions",
    links: [
      { href: "/competitions", label: "All Competitions" },
      { href: "/competitions?filter=cars", label: "Cars" },
      { href: "/competitions?filter=cash", label: "Cash" },
      { href: "/competitions?filter=instant-win", label: "Instant Wins" },
      { href: "/competitions?filter=ending-soon", label: "Ending Soon" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#about", label: "About" },
      { href: "/competitions", label: "Winners" },
      { href: "/#how-it-works", label: "How It Works" },
      { href: "/#faqs", label: "FAQs" },
      { href: "/#contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/rules", label: "Competition Rules" },
      { href: "/responsible-play", label: "Responsible Play" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
];

const socials = [
  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
  { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0B0B0B] text-white/70">
      <div className="pt-16 sm:pt-20 lg:pt-24">
        <TestimonialsHeading />
      </div>

      <div className="relative mt-10 sm:mt-12">
        <Image
          src="/footer-bg.png"
          alt="A family celebrating their PWR win"
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-0 top-0 h-10 bg-linear-to-b from-black to-transparent sm:h-1/3" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black to-transparent sm:h-54" /> */}

        <div className="relative">
          <TestimonialsGrid className="pb-10" />
          <FinalCta />

          <div className="h-px bg-white/12" />

          <div className="container relative grid grid-cols-1 gap-12 py-16 sm:py-20 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/pwr-logo.svg"
                  alt="PWR"
                  width={110}
                  height={54}
                  className="h-25 w-auto"
                />
              </Link>
              <p className="mt-4 max-w-xs text-sm text-white/50">
                Premium UK competitions with verified winners, transparent
                draws and secure entry.
              </p>

              <NewsletterForm className="mt-6" />

              <div className="mt-6 flex items-center gap-3">
                {socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
                  >
                    <social.icon className="size-4" />
                  </Link>
                ))}
              </div>
            </div>

            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-bold tracking-widest text-brand-gold-light uppercase">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-[#0B0B0B]">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/40 sm:flex-row">
          <span>
            © {new Date().getFullYear()} PWR Today — All rights reserved.
          </span>
          <span>18+ only. Please play responsibly.</span>
        </div>
      </div>
    </footer>
  );
}
