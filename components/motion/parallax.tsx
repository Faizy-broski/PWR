"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function Parallax({
  children,
  className,
  speed = 0.3,
  scale = 1.15,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  scale?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const target = targetRef.current;
    if (!wrapper || !target) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { yPercent: -speed * 100, scale },
        {
          yPercent: speed * 100,
          scale,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, wrapper);

    return () => ctx.revert();
  }, [speed, scale]);

  return (
    <div ref={wrapperRef} className={cn("relative overflow-hidden", className)}>
      <div ref={targetRef} className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
