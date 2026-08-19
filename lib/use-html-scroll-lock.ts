import { useEffect, useState } from "react";
import { lenisInstance } from "@/lib/lenis-instance";

const locks = new Set<symbol>();
let previousOverflow = "";

function setLocked(lock: symbol, shouldLock: boolean) {
  if (shouldLock) {
    if (locks.size === 0) {
      previousOverflow = document.documentElement.style.overflow;
      lenisInstance.current?.stop();
    }
    locks.add(lock);
    document.documentElement.style.overflow = "hidden";
  } else {
    locks.delete(lock);
    if (locks.size === 0) {
      document.documentElement.style.overflow = previousOverflow;
      lenisInstance.current?.start();
    }
  }
}

// Base UI's own scroll lock sets `overflow: hidden` on whichever of
// <html>/<body> it detects as the page's real scroll container, but this
// site also runs Lenis (see smooth-scroll-provider.tsx) globally, which
// drives scrolling itself via JS on every wheel/touch event — that bypasses
// native `overflow: hidden` entirely, so the background kept scrolling
// behind open dialogs/sheets. This locks both: the CSS overflow (belt) and
// Lenis directly (suspenders).
//
// Dialog.Portal doesn't render the popup into the DOM at all until the
// dialog is actually opening (and unmounts it again once fully closed), so
// a plain `useRef` passed in from the caller is still null the first time
// this hook's effect runs and never gets a chance to re-run once the node
// shows up. Owning the ref as state instead means the effect re-fires every
// time the popup element itself is attached or detached, and then it
// watches that element's own `data-open`/`data-closed` attribute (which
// Base UI keeps in sync with real open state) to lock only while it's
// actually open. Locks are tracked by identity in a Set so mismatched
// effect re-runs (Fast Refresh, nested dialogs) can't leave the page stuck
// unscrollable.
export function useHtmlScrollLock() {
  const [lock] = useState<symbol>(() => Symbol("html-scroll-lock"));
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!element) return;

    const sync = () => setLocked(lock, element.hasAttribute("data-open"));
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(element, {
      attributes: true,
      attributeFilter: ["data-open", "data-closed"],
    });

    return () => {
      observer.disconnect();
      setLocked(lock, false);
    };
  }, [element, lock]);

  return setElement;
}
