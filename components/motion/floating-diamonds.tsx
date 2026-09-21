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
  driftX: number;
  driftY: number;
  rotate: number;
};

const diamonds: Diamond[] = [
  { top: "8%", left: "6%", size: 22, duration: 9, delay: 0, opacity: 0.25, driftX: 70, driftY: -55, rotate: 25 },
  { top: "18%", left: "88%", size: 16, duration: 10, delay: 0.4, opacity: 0.2, driftX: -75, driftY: 45, rotate: -20 },
  { top: "62%", left: "92%", size: 26, duration: 11, delay: 0.8, opacity: 0.18, driftX: -55, driftY: -65, rotate: 30 },
  { top: "78%", left: "10%", size: 18, duration: 8.5, delay: 1.2, opacity: 0.22, driftX: 60, driftY: 50, rotate: -25 },
  { top: "40%", left: "48%", size: 14, duration: 12, delay: 0.2, opacity: 0.15, driftX: -50, driftY: 60, rotate: 20 },
  { top: "12%", left: "40%", size: 20, duration: 9.5, delay: 1.6, opacity: 0.2, driftX: 70, driftY: -40, rotate: -30 },
  { top: "85%", left: "55%", size: 24, duration: 10.5, delay: 0.6, opacity: 0.16, driftX: -65, driftY: -50, rotate: 22 },
  { top: "50%", left: "4%", size: 16, duration: 9, delay: 1, opacity: 0.2, driftX: 55, driftY: 65, rotate: -18 },
  { top: "28%", left: "20%", size: 18, duration: 10, delay: 0.3, opacity: 0.2, driftX: 75, driftY: -45, rotate: 28 },
  { top: "5%", left: "65%", size: 20, duration: 11.5, delay: 0.9, opacity: 0.18, driftX: -60, driftY: 55, rotate: -22 },
  { top: "70%", left: "78%", size: 15, duration: 8, delay: 1.4, opacity: 0.22, driftX: 50, driftY: -60, rotate: 20 },
  { top: "92%", left: "30%", size: 22, duration: 9.8, delay: 0.5, opacity: 0.17, driftX: -70, driftY: 40, rotate: -26 },
  { top: "35%", left: "85%", size: 17, duration: 10.2, delay: 1.1, opacity: 0.19, driftX: 55, driftY: 65, rotate: 24 },
  { top: "55%", left: "35%", size: 19, duration: 11, delay: 0.7, opacity: 0.16, driftX: -65, driftY: -55, rotate: -20 },
  { top: "15%", left: "15%", size: 13, duration: 9.2, delay: 1.8, opacity: 0.21, driftX: 60, driftY: 50, rotate: 30 },
  { top: "45%", left: "70%", size: 21, duration: 10.8, delay: 0.2, opacity: 0.15, driftX: -55, driftY: -65, rotate: -28 },
];

// Slow-drifting, gently rotating diamond glyphs used behind the Diamond
// Tiers section (and the Diamond marketing pages) for ambient depth.
export function FloatingDiamonds({
  className,
  count = diamonds.length,
  travel = 1,
}: {
  className?: string;
  count?: number;
  travel?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = Array.from({ length: count }, (_, i) => diamonds[i % diamonds.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = containerRef.current?.querySelectorAll("[data-floating-diamond]");
      els?.forEach((el, i) => {
        const d = items[i];
        gsap.to(el, {
          x: d.driftX * travel,
          y: d.driftY * travel,
          rotation: d.rotate,
          duration: d.duration,
          delay: d.delay,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, travel]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {items.map((d, i) => (
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
