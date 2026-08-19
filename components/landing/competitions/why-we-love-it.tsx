"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TabKey = "why" | "details" | "winners";

const TABS: { key: TabKey; label: string }[] = [
  { key: "why", label: "Why we love it" },
  { key: "details", label: "Spec" },
  { key: "winners", label: "Previous winners" },
];

// Deliberately light (white) card sitting inside an otherwise dark page —
// built with literal neutral-* colors rather than the shadcn Tabs
// component's semantic tokens, which would inherit near-white values from
// the page's ".dark" ancestor and render invisible on this white card.
export function WhyWeLoveIt({
  image,
  description,
  facts,
}: {
  image: string;
  description: string;
  facts: { label: string; value: string }[];
}) {
  const [active, setActive] = useState<TabKey>("why");
  const activeLabel = TABS.find((tab) => tab.key === active)?.label ?? "";

  return (
    <div className="rounded-3xl bg-white p-8 text-neutral-900 shadow-2xl sm:p-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <div className="flex gap-6 border-b border-neutral-200">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key)}
                className={cn(
                  "relative pb-3 text-xs font-bold tracking-wide uppercase transition-colors",
                  active === tab.key
                    ? "text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-600",
                )}
              >
                {tab.label}
                {active === tab.key && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-gradient" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-2xl font-extrabold tracking-tight uppercase">
              {activeLabel}
            </h3>

            <div className="mt-4">
              {active === "why" && (
                <p className="text-sm leading-relaxed text-neutral-600">
                  {description}
                </p>
              )}

              {active === "details" && (
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-neutral-500">{fact.label}</dt>
                      <dd className="font-semibold">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {active === "winners" && (
                <p className="text-sm leading-relaxed text-neutral-600">
                  This competition&apos;s winner will be announced here once
                  it closes — see past winners on our{" "}
                  <Link
                    href="/winners"
                    className="underline underline-offset-2"
                  >
                    winners page
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
