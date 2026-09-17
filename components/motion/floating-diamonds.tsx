"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Gem } from "lucide-react";
import { cn } from "@/lib/utils";

type Diamond = {
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

const diamonds: Diamond[] = [
  { top: "8%", left: "6%", size: 22, duration: 6, delay: 0, opacity: 0.25 },
  { top: "18%", left: "88%", size: 16, duration: 7.5, delay: 0.4, opacity: 0.2 },
  { top: "62%", left: "92%", size: 26, duration: 8, delay: 0.8, opacity: 0.18 },
  { top: "78%", left: "10%", size: 18, duration: 6.5, delay: 1.2, opacity: 0.22 },
  { top: "40%", left: "48%", size: 14, duration: 9, delay: 0.2, opacity: 0.15 },
  { top: "12%", left: "40%", size: 20, duration: 7, delay: 1.6, opacity: 0.2 },
  { top: "85%", left: "55%", size: 24, duration: 8.5, delay: 0.6, opacity: 0.16 },
  { top: "50%", left: "4%", size: 16, duration: 6.8, delay: 1, opacity: 0.2 },
];

// Slow-drifting, gently rotating diamond glyphs used behind the Diamond
// Tiers section for ambient depth without distracting from the cards.
export function FloatingDiamonds({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll("[data-floating-diamond]");
      items?.forEach((el, i) => {
        const d = diamonds[i % diamonds.length];
        gsap.to(el, {
          y: -24,
          x: i % 2 === 0 ? 12 : -12,
          rotation: i % 2 === 0 ? 20 : -20,
          duration: d.duration,
          delay: d.delay,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {diamonds.map((d, i) => (
        <Gem
          key={i}
          data-floating-diamond
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
          }}
          className="absolute text-brand-gold-light"
        />
      ))}
    </div>
  );
}
