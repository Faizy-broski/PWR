"use client";

import { cn } from "@/lib/utils";

export interface FilterPillOption {
  label: string;
  value: string;
}

export function FilterPills({
  options,
  value,
  onChange,
  className,
  variant = "light",
}: {
  options: FilterPillOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: "light" | "dark" | "segmented";
}) {
  if (variant === "segmented") {
    return (
      <div
        className={cn(
          "flex w-full items-stretch gap-3 overflow-x-auto rounded-full bg-white p-2 md:gap-4",
          className
        )}
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cn(
                "shrink-0 rounded-full px-4 py-3 text-xs font-bold tracking-wide whitespace-nowrap uppercase transition-colors duration-200 md:flex-1",
                active
                  ? "bg-brand-gradient text-black"
                  : "border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto",
        variant === "dark" && "rounded-full border border-white/10 bg-white/5 p-1.5",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors duration-200",
              variant === "dark"
                ? active
                  ? "bg-brand-gradient text-white"
                  : "text-white/60 hover:text-white"
                : cn(
                    "border",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  )
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
