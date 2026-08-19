"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

// Root Suspense fallback — shown while a route segment streams in (initial
// loads, hard navigations, or any page without its own loading.tsx). Client
// navigations get their own transition via components/motion/route-loader.tsx;
// this one covers everything that reaches the server before a route exists
// to intercept.
export default function Loading() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set([markRef.current, ringRef.current], { opacity: 0 });

      const intro = gsap.timeline();
      intro
        .fromTo(
          markRef.current,
          { opacity: 0, y: 20, scale: 0.8, rotate: -8 },
          { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" }
        )
        .fromTo(
          ringRef.current,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
          "-=0.35"
        );

      gsap.to(ringRef.current, {
        rotate: 360,
        duration: 2.2,
        ease: "none",
        repeat: -1,
      });

      gsap.to(blobARef.current, {
        x: 40,
        y: -30,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(blobBRef.current, {
        x: -30,
        y: 40,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(dotsRef.current, {
        y: -6,
        opacity: 1,
        duration: 0.5,
        stagger: {
          each: 0.15,
          repeat: -1,
          yoyo: true,
        },
        ease: "power1.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-[#0D0C0C]"
    >
      <div
        ref={blobARef}
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 size-80 rounded-full bg-brand-gold-dark/20 blur-3xl"
      />
      <div
        ref={blobBRef}
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full bg-brand-gold-light/10 blur-3xl"
      />

      <div className="relative flex size-24 items-center justify-center sm:size-28">
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-gold-light border-r-brand-gold-dark"
        />
        <div ref={markRef}>
          <Image
            src="/pwr-logo.svg"
            alt="PWR"
            width={80}
            height={39}
            className="h-10 w-auto sm:h-11"
            priority
          />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              dotsRef.current[i] = el;
            }}
            className="block size-1.5 rounded-full bg-white/40 opacity-40"
          />
        ))}
      </div>

      <p className="mt-6 text-xs font-semibold tracking-[0.3em] text-white/40 uppercase">
        Loading
      </p>
    </div>
  );
}
