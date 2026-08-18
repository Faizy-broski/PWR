"use client";

import { SearchX } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function WinnersEmptyState({
  title = "No winners found",
  description = "Try a different category or search term.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-20 text-center",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-white/3 text-white/30">
        <SearchX className="size-5" strokeWidth={1.75} />
      </span>
      <p className="text-sm font-bold tracking-wide text-white uppercase">
        {title}
      </p>
      <p className="max-w-xs text-sm text-white/40">{description}</p>
    </motion.div>
  );
}
