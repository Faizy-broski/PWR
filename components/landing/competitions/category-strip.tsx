import Image from "next/image";
import Link from "next/link";
import { Crown, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  label: string;
  href: string;
  icon?: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { label: "Featured Competition", href: "/competitions?filter=featured", icon: "/svg's/star.svg" },
  { label: "Ends Today", href: "/competitions?filter=ends-today", icon: "/svg's/clock.svg" },
  { label: "Ends Tomorrow", href: "/competitions?filter=ends-tomorrow", icon: "/svg's/calendar.svg" },
  { label: "Instant Win", href: "/competitions?filter=instant-win", icon: "trophy" },
  { label: "Ends Soon", href: "/competitions?filter=ends-soon", icon: "/svg's/timer.svg" },
  { label: "Free Comps", href: "/competitions?filter=free", icon: "/svg's/gift.svg" },
  { label: "Pass Exclusive", href: "/competitions?filter=pass-exclusive" },
];

export function CategoryStrip({
  items = DEFAULT_CATEGORIES,
  className,
}: {
  items?: CategoryItem[];
  className?: string;
}) {
  const marqueeItems = [...items, ...items];

  return (
    <nav
      className={cn("border-b border-border bg-background", className)}
      aria-label="Competition categories"
    >
      <div className="group/marquee overflow-hidden px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="category-marquee-track flex w-max items-center gap-x-5 sm:gap-x-7 lg:gap-x-10">
          {marqueeItems.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              href={item.href}
              aria-hidden={index >= items.length}
              tabIndex={index >= items.length ? -1 : undefined}
              className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground sm:gap-2 sm:text-base lg:text-lg"
            >
              {item.icon === "trophy" ? (
                <Trophy className="size-5 shrink-0 transition-transform duration-300 group-hover:scale-110 sm:size-6 lg:size-7" />
              ) : item.icon ? (
                <Image
                  src={item.icon}
                  alt=""
                  width={18}
                  height={18}
                  className="size-5 shrink-0 transition-transform duration-300 group-hover:scale-110 sm:size-6 lg:size-7"
                />
              ) : (
                <Crown className="size-4 shrink-0 text-brand-gold-light transition-transform duration-300 group-hover:scale-110 sm:size-4.5" />
              )}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes category-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .category-marquee-track {
          animation: category-marquee-scroll 30s linear infinite;
        }
        .group\\/marquee:hover .category-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .category-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </nav>
  );
}