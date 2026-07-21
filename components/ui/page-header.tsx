"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import RevealOnScroll from "./reveal-on-scroll";
import { hasWebGL } from "@/lib/webgl-support";

/**
 * Page heading for the inner routes — the page name as refractive smoked-glass
 * letterforms (the same Text3D + MeshTransmissionMaterial treatment as the
 * welcome wordmark), with a supporting line beneath. Used by all five nav pages
 * so they read as one set; the home page has no header, since the hero is its
 * identity.
 *
 * ── Two renderings of the same heading ──────────────────────────────────────
 * Eligible sessions (WebGL, real motion, > 768px) get the glass. Everything else
 * — phones, reduced-motion, no-WebGL — keeps the flat glass PILL, which is what
 * this component used to be. That split follows cloud-layer.tsx: a transmission
 * material renders the scene to an offscreen buffer (twice, with backside on),
 * which is not a cost worth paying on a phone GPU for a static heading.
 *
 * The gate is a useSyncExternalStore whose SERVER snapshot is `false`, so the
 * HTML always ships the pill and the glass swaps in after hydration — no
 * mismatch, and it re-evaluates live when the breakpoint or motion pref changes.
 *
 * ⚠️ ACCESSIBILITY: the <h1> text stays in the DOM in BOTH renderings. When the
 * glass is showing, the heading is `sr-only` and the canvas is aria-hidden — a
 * canvas of pixels is not a heading, and this is the page's only h1, so losing
 * it would cost the route its document outline in search and screen readers.
 *
 * ⚠️ NO `data-reveal-*` hooks anywhere here. Those are hidden globally by
 * `.reveal-armed` (globals.css) and only <HeroReveal> un-hides them — and that
 * runs on `/` alone, so any such hook would leave this header invisible on every
 * page that uses it. Markup renders FINISHED; <RevealOnScroll> adds the entrance
 * once it knows it will animate.
 */

// Client-only: pulls three/drei, and `ssr:false` can't live in a Server
// Component. Ineligible sessions never request the chunk at all.
const GlassHeadingScene = dynamic(() => import("./glass-heading-scene"), {
  ssr: false,
});

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";
const SMALL_SCREEN = "(max-width: 768px)";

function subscribe(callback: () => void) {
  const mqs = [window.matchMedia(REDUCE_MOTION), window.matchMedia(SMALL_SCREEN)];
  mqs.forEach((mq) => mq.addEventListener("change", callback));
  return () => mqs.forEach((mq) => mq.removeEventListener("change", callback));
}

function getSnapshot() {
  return (
    hasWebGL() &&
    !window.matchMedia(REDUCE_MOTION).matches &&
    !window.matchMedia(SMALL_SCREEN).matches
  );
}

function useGlassEligible() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * The stage both renderings sit in.
 *
 * ⚠️ ONE FIXED HEIGHT FOR BOTH, and that matters beyond tidiness. The server
 * always ships the pill and the glass swaps in after hydration — so if the two
 * renderings were different heights, every section below would JUMP at that
 * moment. That is a layout shift (bad on its own), but worse here: ScrollTrigger
 * has already measured the page, and `/why-us` PINS a section whose scroll range
 * is derived from those measurements. Moving the content under a live pin is how
 * you get a scroll that behaves oddly around the pinned section.
 *
 * Keep these in lockstep if you resize the heading.
 */
// Sized for the glass: at ~1146×340 the glyph lands at ~3.3 world units (inside
// the intro's own ~4–5 range, which is what makes the intro's absolute material
// values reproduce its look), and the longest heading — "services" — measures
// ~985px, comfortably inside the 1146px column.
const STAGE = "h-[340px] max-md:h-[190px]";
const STAGE_W = "w-full max-w-[1146px]";

/** The flat pill — the pre-glass rendering, kept as the fallback. */
function HeadingPill({ title }: { title: string }) {
  return (
    <div className={`flex ${STAGE} ${STAGE_W} items-center justify-center`}>
      <h1 className="w-max max-w-full rounded-[20px] border-[1.5px] border-solid border-white/30 bg-gradient-to-b from-black/10 to-black/5 px-[26px] py-[9px] font-product text-display font-light leading-[1.1] tracking-[-0.03em] text-white shadow-[inset_0_0_0_999px_rgba(255,255,255,0.06)]">
        {title}
      </h1>
    </div>
  );
}

export default function PageHeader({
  title,
  sub,
}: {
  title: string;
  sub: string;
}) {
  const glass = useGlassEligible();

  return (
    <section className="relative flex w-full flex-col items-center gap-[22px] px-6 pt-[22dvh] pb-[8dvh] text-center max-md:pt-[16dvh]">
      <RevealOnScroll selector="[data-page-header] > *" />
      <div data-page-header className="flex flex-col items-center gap-[22px]">
        {glass ? (
          // Same fixed stage as the pill (see STAGE) so the swap-in after
          // hydration moves nothing. The heading text is kept in the DOM for
          // assistive tech and search; only the pixels come from GL.
          <div className={`relative ${STAGE} ${STAGE_W}`}>
            <h1 className="sr-only">{title}</h1>
            <GlassHeadingScene text={title} />
          </div>
        ) : (
          <HeadingPill title={title} />
        )}
        <p className="max-w-[620px] font-product text-body-lg font-light leading-normal tracking-[0.02em] text-white/60">
          {sub}
        </p>
      </div>
    </section>
  );
}
