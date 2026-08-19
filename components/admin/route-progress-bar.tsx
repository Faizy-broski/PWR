"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// A slim top progress bar for admin navigation — deliberately NOT a
// full-page loading skeleton (that flash-replaces the whole dashboard with
// placeholder blocks on every click, which reads as more "broken" than
// "loading" for an app this fast). The previous page just stays on screen
// until the next one is ready; this bar is the only feedback that
// something is happening.
export function AdminRouteProgressBar() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      if (safetyRef.current) clearTimeout(safetyRef.current);
      setActive(true);
      safetyRef.current = setTimeout(() => setActive(false), 8000);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0 });
    tweenRef.current = gsap.to(bar, {
      scaleX: 0.8,
      duration: 1.2,
      ease: "power1.out",
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [active]);

  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;
    if (!active) return;
    if (safetyRef.current) clearTimeout(safetyRef.current);

    const bar = barRef.current;
    if (!bar) {
      setActive(false);
      return;
    }

    tweenRef.current?.kill();
    gsap.to(bar, {
      scaleX: 1,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(bar, {
          opacity: 0,
          duration: 0.25,
          delay: 0.1,
          onComplete: () => {
            setActive(false);
            gsap.set(bar, { opacity: 1, scaleX: 0 });
          },
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (safetyRef.current) clearTimeout(safetyRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-999 h-[3px]">
      <div
        ref={barRef}
        className="bg-brand-gradient h-full w-full origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
