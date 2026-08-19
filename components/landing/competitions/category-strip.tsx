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
  return (
    <nav
      className={cn("border-b border-border bg-background", className)}
      aria-label="Competition categories"
    >
      <div className="container flex items-center gap-x-5 overflow-x-auto py-3 no-scrollbar sm:flex-wrap sm:justify-between sm:gap-x-8 sm:gap-y-2 sm:overflow-visible sm:py-4">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group flex shrink-0 items-center gap-1.5 text-xs font-semibold whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground sm:gap-2 sm:text-sm"
          >
            {item.icon === "trophy" ? (
              <Trophy className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-110 sm:size-4.5" />
            ) : item.icon ? (
              <Image
                src={item.icon}
                alt=""
                width={16}
                height={16}
                className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-110 sm:size-8"
              />
            ) : (
              <Crown className="size-3.5 shrink-0 text-brand-gold-light transition-transform duration-300 group-hover:scale-110 sm:size-4" />
            )}
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
