import type { CSSProperties } from "react";
import TestimonialRocks from "./testimonial-rocks";
import TestimonialsDrift from "./testimonials-drift";
import TestimonialsQuoteReveal from "./testimonials-quote-reveal";
import { TESTIMONIALS, UNITS } from "./testimonials-data";

/**
 * Testimonials (Figma node 482:418). A single centred pull-quote floating in
 * open sky, framed by four grey rocks — two large in opposite corners, two
 * small — each encircled by a thin white "orbit" outline with an accent dot.
 *
 * Like every other section it renders at DESIGN SCALE (fixed px, centre-
 * anchored) and stays TRANSPARENT over the global fixed <Background/> (fill →
 * grain → clouds) mounted in layout.tsx. The Figma frame's own #62abff fill,
 * grain and the decorative bottom-left cloud are intentionally NOT reproduced —
 * the shared sky + global cloud layer already provide that atmosphere.
 *
 * The one centre-anchored block is the Figma `TestimonialRocks` group
 * (1239.771 × 595.775, itself centred in the 1512×982 frame). Layers, back→front:
 *   1. <TestimonialRocks/> — the rocks: a 3D GLB canvas on capable devices, a
 *      flat PNG still otherwise.
 *   2. rings + dots (DOM, per unit) — painted ABOVE the rocks so the outline
 *      hoop passes in front of the rock (its z-axis position), not behind it;
 *      the dot revolves via TestimonialsDrift.
 *   3. the quote (on top, always legible)
 *
 * Geometry (UNITS) lives in testimonials-data.ts so the rings here and the rocks
 * in the canvas share one source of truth.
 */

// The group's design size (Figma `TestimonialRocks`). The box is capped-fluid, so
// every offset inside is emitted as a fraction of these — at the design size the
// fractions resolve to the original px exactly, and below it the composition
// compresses with the box rather than hanging off the edges.
const GROUP_W = 1239.771;
const GROUP_H = 595.775;
const groupX = (x: number) => `${(x / GROUP_W) * 100}%`;
const groupY = (y: number) => `${(y / GROUP_H) * 100}%`;

export default function Testimonials() {
  const { quote, attribution } = TESTIMONIALS[0];

  return (
    <section
      data-testimonials
      // Desktop content-driven (no min-h-dvh): the rock/quote block is a fixed
      // 595px. 25dvh viewport-proportional padding matches the full-screen
      // tagline/cards breathing room, so the rhythm scales with the viewport
      // and stays consistent across sections (see comparison.tsx). Mobile keeps
      // min-h-dvh so the rocks re-anchor to the real viewport corners
      // (max-md:inset-0 below); the block is absolute there, so the padding
      // doesn't affect the mobile height.
      className="relative flex max-md:min-h-dvh w-full items-center justify-center overflow-hidden px-6 py-[25dvh] max-md:px-0"
    >
      {/* Centre-anchored design block = the Figma TestimonialRocks group. Below
          md it fills the section (absolute inset-0) so the four rocks re-anchor
          to the REAL viewport corners around the reflowed quote, instead of the
          1239px group's off-screen corners.
          CAPPED-FLUID between those two regimes: at ≥1288 this is exactly
          1239.771px (unchanged), and below it the box narrows so the group stops
          hanging off both edges. Everything positioned inside is expressed as a
          PERCENTAGE of the group (see UNITS and the quote), so the composition
          compresses with the box instead of clipping. */}
      <div className="relative h-[595.775px] w-full max-w-[1239.771px] max-md:absolute max-md:inset-0 max-md:h-auto max-md:w-auto max-md:max-w-none">
        {/* Rocks — 3D GLB canvas (capable devices) or flat PNG fallback.
            Rendered FIRST so the rings below paint on top of it. */}
        <TestimonialRocks />

        {/* Ring outlines + dots — one point-anchored unit each; the dot revolves
            about the centre (TestimonialsDrift). Painted after the rocks so the
            hoop crosses IN FRONT of the rock (its z-position), not behind it. */}
        {UNITS.map((u, i) => (
          <div
            key={i}
            data-tm-unit
            aria-hidden
            // Desktop centre (--x/--y) → mobile corner (--mx/--my), switched by
            // the max-md variants; the mobile scale rides this wrapper (about its
            // top-left = the shared centre), so the ring's revolve/reveal scale on
            // [data-tm-ring] inside stays free (same wrapper-vs-inner split cards
            // uses). The rock in testimonial-rocks.tsx reads the same trio, so
            // rock + ring stay concentric.
            className="pointer-events-none absolute left-[var(--x)] top-[var(--y)] max-md:left-[var(--mx)] max-md:top-[var(--my)] max-md:origin-top-left max-md:[transform:scale(var(--ms))]"
            style={
              {
                // PERCENTAGES of the group box, not px: the box is capped-fluid
                // now, so a px offset would keep its distance from the (moving)
                // left edge and march the right-hand rings off the card as the
                // group narrows. At the design size these resolve to exactly the
                // original px. See GROUP_W in testimonials-data.ts.
                "--x": groupX(u.cx),
                "--y": groupY(u.cy),
                "--mx": u.mx,
                "--my": u.my,
                "--ms": u.ms,
              } as CSSProperties
            }
          >
            <div data-tm-ring className="absolute left-0 top-0 h-0 w-0">
              <span
                className="absolute rounded-full border border-solid border-white"
                style={{
                  left: -u.ring.r,
                  top: -u.ring.r,
                  width: u.ring.r * 2,
                  height: u.ring.r * 2,
                  borderWidth: u.ring.stroke,
                }}
              />
              <span
                className="absolute rounded-full bg-white"
                style={{
                  left: u.dot.dx - u.dot.r,
                  top: u.dot.dy - u.dot.r,
                  width: u.dot.r * 2,
                  height: u.dot.r * 2,
                }}
              />
            </div>
          </div>
        ))}

        {/* The pull-quote — centred in the group (box left 120, w 1000). Same
            49px mixed-font heading treatment as the sibling sections; below md it
            decouples from the group and centres in the viewport at the fluid
            token size (the group scale would shrink it to ~14px — unreadable). */}
        {/* left 120 / width 1000 of the 1239.771 group, as percentages — the one
            piece of real CONTENT in this section, so it must never be the thing
            that gets clipped. At design size these are the original px. */}
        <div className="absolute left-[9.6792%] top-[244px] w-[80.6600%] text-center max-md:left-0 max-md:right-0 max-md:top-1/2 max-md:w-auto max-md:-translate-y-1/2 max-md:px-6">
          <p
            data-testimonials-quote
            className="relative z-10 text-display font-light leading-[1.1] tracking-[-0.03em] text-white [word-break:break-word]"
          >
            {quote.map((seg, i) => (
              <span key={i} className={seg.serif ? "font-instrument" : undefined}>
                {seg.text}
              </span>
            ))}
          </p>

          {/* Attribution — present only for quotes we can actually attribute.
              The node always renders so the reveal driver has something stable
              to write into on each cycle; it is EMPTY for the invented quotes,
              which is what stops a fabricated line ever appearing under a real
              person's name. Reserved height keeps the quote from shifting as
              the rotation swaps an attributed quote for an unattributed one. */}
          <p
            data-testimonials-attrib
            className="relative z-10 mt-[18px] min-h-[1.4em] font-product text-body font-light leading-normal tracking-[0.02em] text-white/60"
          >
            {attribution ?? ""}
          </p>
        </div>
      </div>

      <TestimonialsDrift />
      <TestimonialsQuoteReveal />
    </section>
  );
}
