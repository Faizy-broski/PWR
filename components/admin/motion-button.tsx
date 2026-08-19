"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// A thin hover/tap wrapper for admin CTAs — kept separate from the shared
// Button primitive (used site-wide, including marketing pages) so this
// extra spring only touches admin surfaces.
export function MotionButton({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="inline-block"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
