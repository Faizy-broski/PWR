"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

export function NotFoundContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const digitRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const shapeRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        digitRefs.current,
        { opacity: 0, y: 60, rotate: -20, scale: 0.6 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(2.4)",
        }
      ).fromTo(
        bodyRef.current?.children ?? [],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" },
        "-=0.25"
      );

      shapeRefs.current.forEach((shape, i) => {
        if (!shape) return;
        gsap.to(shape, {
          y: i % 2 === 0 ? -18 : 18,
          x: i % 2 === 0 ? 10 : -10,
          rotate: i % 2 === 0 ? 12 : -12,
          duration: 3 + i * 0.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Occasional playful "jiggle" on the digits, like they can't quite
      // settle on being a real page.
      const jiggle = gsap.timeline({ repeat: -1, repeatDelay: 4 });
      jiggle.to(digitRefs.current, {
        y: -6,
        duration: 0.18,
        stagger: 0.06,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-4 py-24 text-center"
    >
      <span
        ref={(el) => {
          shapeRefs.current[0] = el;
        }}
        aria-hidden
        className="pointer-events-none absolute top-[15%] left-[12%] size-10 rounded-full border-2 border-brand-gold-dark/30 sm:size-14"
      />
      <span
        ref={(el) => {
          shapeRefs.current[1] = el;
        }}
        aria-hidden
        className="bg-brand-gradient pointer-events-none absolute right-[14%] bottom-[20%] size-6 rounded-md opacity-30 sm:size-8"
      />
      <span
        ref={(el) => {
          shapeRefs.current[2] = el;
        }}
        aria-hidden
        className="pointer-events-none absolute right-[20%] top-[22%] size-3 rounded-full bg-brand-gold-light/50 sm:size-4"
      />

      <div className="relative flex select-none text-8xl font-extrabold tracking-tight sm:text-9xl">
        {["4", "0", "4"].map((digit, i) => (
          <span
            key={i}
            ref={(el) => {
              digitRefs.current[i] = el;
            }}
            className={i === 1 ? "text-brand-gradient" : "text-foreground"}
            style={{ opacity: 0 }}
          >
            {digit}
          </span>
        ))}
      </div>

      <div ref={bodyRef} className="relative flex flex-col items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button
            variant="gradient"
            className="rounded-full px-6"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Back to home
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-6"
            nativeButton={false}
            render={<Link href="/competitions" />}
          >
            Browse competitions
          </Button>
        </div>
      </div>
    </div>
  );
}
