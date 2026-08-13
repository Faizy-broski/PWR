"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const wordVariants: Variants = {
  hidden: { y: "125%", rotate: 4 },
  visible: { y: "0%", rotate: 0 },
};

export function TextReveal({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  once = true,
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const words = text.split(" ");

  return (
    <Tag className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-top pb-[0.15em]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once, amount: 0.6 }}
        >
          <motion.span
            className={cn("inline-block", wordClassName)}
            variants={wordVariants}
            transition={{
              duration: 0.75,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i !== words.length - 1 ? " " : ""}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}

const charVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function CharReveal({
  text,
  as: Tag = "span",
  className,
  charClassName,
  delay = 0,
  stagger = 0.02,
  once = true,
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const chars = Array.from(text);

  return (
    <Tag className={cn("inline-block", className)}>
      <motion.span
        className="inline-block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.6 }}
      >
        {chars.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className={cn("inline-block", charClassName)}
            variants={charVariants}
            transition={{
              duration: 0.4,
              delay: delay + i * stagger,
              ease: "easeOut",
            }}
          >
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
