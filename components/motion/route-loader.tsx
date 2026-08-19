"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const MIN_VISIBLE_MS = 550;
const SAFETY_TIMEOUT_MS = 6000;

function isInternalNavigationClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

  const anchor = (event.target as HTMLElement)?.closest?.(
    "a[href]"
  ) as HTMLAnchorElement | null;
  if (!anchor) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;

  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;

  // Same-path hash jumps are handled by SmoothScrollProvider, not a route change.
  if (url.pathname === window.location.pathname) return null;

  // The admin dashboard has its own slim top progress bar (see
  // AdminRouteProgressBar) — this full-screen branded wipe is for the
  // marketing site, so it skips anything touching /admin.
  if (
    url.pathname.startsWith("/admin") ||
    window.location.pathname.startsWith("/admin")
  ) {
    return null;
  }

  return url;
}

// A branded transition overlay played on every internal navigation. App
// Router route changes are usually near-instant, so this is deliberately not
// tied to real load time — it holds for MIN_VISIBLE_MS so the transition
// reads as intentional rather than a flicker, then wipes away once the new
// route has rendered (pathname change). A safety timeout guards against a
// navigation that never lands (e.g. click handled elsewhere, then aborted).
export function RouteLoader() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const markRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const enteredAtRef = useRef(0);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barTweenRef = useRef<gsap.core.Tween | null>(null);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const url = isInternalNavigationClick(event);
      if (!url) return;

      if (safetyRef.current) clearTimeout(safetyRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
      enteredAtRef.current = performance.now();
      setActive(true);

      safetyRef.current = setTimeout(() => setActive(false), SAFETY_TIMEOUT_MS);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // Play the entrance the moment the overlay mounts.
  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    const bar = barRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        panelRefs.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: "power4.inOut",
          transformOrigin: "top",
        }
      )
        .fromTo(
          markRef.current,
          { opacity: 0, y: 16, scale: 0.85, rotate: -6 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.5,
            ease: "back.out(2.2)",
          },
          "-=0.15"
        )
        .fromTo(bar, { scaleX: 0 }, { scaleX: 0.35, duration: 0.4, ease: "power2.out" }, "-=0.3");

      if (bar) {
        barTweenRef.current = gsap.to(bar, {
          scaleX: 0.88,
          duration: 1.6,
          ease: "power1.out",
          delay: 0.1,
        });
      }
    }, root);

    return () => {
      barTweenRef.current?.kill();
      ctx.revert();
    };
  }, [active]);

  // Wipe out once the destination route has actually rendered.
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;
    if (!active) return;

    const elapsed = performance.now() - enteredAtRef.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    exitTimeoutRef.current = setTimeout(() => {
      if (safetyRef.current) clearTimeout(safetyRef.current);
      barTweenRef.current?.kill();

      const bar = barRef.current;
      if (!rootRef.current) {
        setActive(false);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => setActive(false),
      });

      tl.to(bar, { scaleX: 1, duration: 0.25, ease: "power2.out" })
        .to(
          markRef.current,
          { opacity: 0, y: -12, scale: 0.9, duration: 0.3, ease: "power2.in" },
          "-=0.05"
        )
        .to(panelRefs.current, {
          scaleY: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power4.inOut",
          transformOrigin: "bottom",
        });
    }, wait);

    return () => {
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (safetyRef.current) clearTimeout(safetyRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  if (!active) return null;

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-auto fixed inset-0 z-999">
      <div className="absolute inset-0 grid grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="bg-[#0D0C0C]"
            style={{ transform: "scaleY(0)" }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <div ref={markRef} style={{ opacity: 0 }}>
          <Image
            src="/pwr-logo.svg"
            alt="PWR"
            width={120}
            height={58}
            className="h-12 w-auto sm:h-24"
            priority
          />
        </div>
        <div className="h-px w-40 overflow-hidden rounded-full bg-white/10 sm:w-56">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-brand-gradient"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
