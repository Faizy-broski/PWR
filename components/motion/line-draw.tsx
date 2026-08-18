"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function LineDraw({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <span
      ref={lineRef}
      className={cn(
        "block h-0.5 w-8 origin-left bg-brand-gold-dark",
        className
      )}
      aria-hidden
    />
  );
}
