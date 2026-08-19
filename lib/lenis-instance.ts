import type Lenis from "lenis";

// A single shared handle to the page's Lenis instance (see
// smooth-scroll-provider.tsx), so code outside that provider — e.g. the
// modal scroll lock — can pause/resume it. Lenis drives scrolling itself
// via JS on every wheel/touch event, so CSS `overflow: hidden` alone
// doesn't stop it; it has to be told to stop directly.
export const lenisInstance: { current: Lenis | null } = { current: null };
