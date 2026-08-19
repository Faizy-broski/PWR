"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Split out from StatCard so the card itself can stay a Server Component —
// passing a lucide icon *component* (a function) as a prop into a Client
// Component isn't allowed across the RSC boundary, but passing already
// -rendered children (the icon JSX, rendered server-side) is fine.
export function HoverLift({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
