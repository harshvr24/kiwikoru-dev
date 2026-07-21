"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Per-route housekeeping for App Router client navigations. Renders nothing.
 *
 * A client navigation swaps the page subtree without a document load, so two
 * things that "just work" on a hard refresh silently do not:
 *
 *  1. SCROLL POSITION — Lenis owns the scroll and keeps its offset across the
 *     swap, so navigating from halfway down the home page lands you halfway down
 *     the new one. layout.tsx's `history.scrollRestoration = "manual"` only
 *     covers real page loads.
 *  2. SCROLLTRIGGER MEASUREMENTS — every trigger's start/end was computed
 *     against the OLD document height. Pinned sections are the visible casualty:
 *     /why-us's reel would pin against the previous route's layout.
 *
 * ⚠️ This deliberately does NOT touch the intro gate. It used to call a
 * `resetIntroWillPlay()` so the memo re-derived per route — which let
 * <HeroReveal> and <Intro> read different answers and painted the welcome over
 * an already-revealed hero. See the warning on introWillPlay() in
 * intro-state.ts before reaching for that again.
 *
 * Order matters: scroll to the top FIRST, then refresh ScrollTrigger, so
 * triggers measure against the settled layout rather than mid-scroll.
 * `immediate: true` skips Lenis' easing — a smooth-scrolled jump to the top on
 * every navigation reads as a glitch, not a transition.
 */
export default function RouteTransition() {
  const pathname = usePathname();
  const lenis = useLenis();
  // Skip the very first run: on a fresh load the browser is already at the top,
  // the intro gate has not been read yet, and ScrollTrigger has nothing built.
  // Refreshing here would fight <Intro>'s own measure-and-place pass.
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    lenis?.scrollTo(0, { immediate: true });

    // Let the swapped subtree lay out before re-measuring. Two frames: one for
    // the commit, one for the resulting layout/paint.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.refresh();
      }),
    );
    return () => cancelAnimationFrame(raf);
  }, [pathname, lenis]);

  return null;
}
