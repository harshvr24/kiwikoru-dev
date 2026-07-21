"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// useLayoutEffect on the client (park the elements before paint if the block is
// already in view on load); falls back to useEffect during SSR.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Generic scroll-in entrance for the inner pages' content blocks — a staggered
 * fade + small lift, played once as the block enters the viewport. Renders
 * nothing; it drives whatever `selector` matches.
 *
 * This exists because the inner routes CANNOT use the site's declarative
 * `data-reveal-*` hooks. Those are hidden globally by `.reveal-armed`
 * (globals.css) and un-hidden only by <HeroReveal>, which bails unless
 * `[data-hero]` is present — i.e. it runs on `/` alone. A `data-reveal-*`
 * attribute on any other route is a permanent `opacity: 0`; that is exactly the
 * bug that made the navbar disappear when it moved into the layout.
 *
 * House-rules compliance (CLAUDE.md's heavy-effect contract):
 *  • Rides GSAP's shared ticker via ScrollTrigger — no private rAF loop.
 *  • One-shot (`once: true`), so it idles to zero after playing.
 *  • Markup renders FINISHED. SSR, no-JS and reduced-motion all show the real
 *    content; elements are hidden only once we know we will animate them.
 *  • `gsap.context` scoping means revert() cleans up the tweens AND their
 *    ScrollTriggers on unmount — required, since these mount per route.
 */
export default function RevealOnScroll({
  selector,
  y = 18,
  stagger = 0.08,
}: {
  /** CSS selector for the elements to reveal. Queried from `document`. */
  selector: string;
  /** Starting offset in px. */
  y?: number;
  /** Gap between each element's start, in seconds. */
  stagger?: number;
}) {
  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia(REDUCE_MOTION).matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!els.length) return;

    let played = false;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger,
          // Trigger on the FIRST element rather than the section: these blocks
          // are tall, and a section-top trigger would fire while the content is
          // still below the fold.
          scrollTrigger: {
            trigger: els[0],
            start: "top 85%",
            once: true,
            onEnter: () => {
              played = true;
            },
          },
        },
      );
    });

    // FAILSAFE — this hides real page content, so it must never be able to
    // strand it. The `fromTo` parks the elements at opacity 0 immediately, and
    // only ScrollTrigger brings them back; if the trigger never fires, the
    // content is invisible with nothing in the console to say why. That is not
    // hypothetical: a paused rAF (a backgrounded tab throttles the ticker
    // ScrollTrigger rides on) or a bad refresh after a route change both
    // produce it. After 2s, just show everything.
    //
    // Same belt-and-braces pattern the rest of the app uses for one-way gates
    // (intro-loader's HOLD_LIMIT_MS, quality-controller's WATCHDOG_FAILSAFE_MS).
    const failsafe = window.setTimeout(() => {
      if (played) return;
      gsap.set(els, { autoAlpha: 1, y: 0 });
    }, 2000);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [selector, y, stagger]);

  return null;
}
