"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

// Slow-drifting gold/dark glow pair used behind full-bleed dark pages
// (error, not-found, loading, checkout, entered) for a consistent ambient
// feel without repeating the gsap setup in every one of them.
export function AmbientBlobs({ className }: { className?: string }) {
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blobARef.current, {
        x: 40,
        y: -30,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(blobBRef.current, {
        x: -30,
        y: 40,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div
        ref={blobARef}
        className="absolute -top-32 -left-24 size-80 rounded-full bg-brand-gold-dark/20 blur-3xl"
      />
      <div
        ref={blobBRef}
        className="absolute -right-24 -bottom-32 size-96 rounded-full bg-brand-gold-light/10 blur-3xl"
      />
    </div>
  );
}
