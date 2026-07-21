/**
 * Testimonials geometry + copy (Figma node 482:418).
 *
 * GEOMETRY (UNITS) — shared by the server section (rings/dots + flat fallback
 * rocks) and the client 3D rock canvas, so they stay in one place. The block is
 * the Figma `TestimonialRocks` group; every unit is a rock + its ring + its dot
 * sharing one centre (the ring centre = Figma ellipse frame offset (20.28,17) +
 * each circle's centre; dot offset = dot centre − ring centre; rocks share the
 * ring centre). `size` is the rock's intended on-screen footprint in px — the
 * rock overflows its ring as in the mock (~1.36× the ring diameter).
 *
 * COPY (TESTIMONIALS) — a quote is a list of segments so the mixed-font accent
 * (`already raised` in Instrument Serif) survives as structured data and the
 * section can later cycle several quotes with one renderer.
 */

/** The Figma TestimonialRocks group bounds — the centre-anchored design block. */
export const GROUP_W = 1239.771;
export const GROUP_H = 595.775;

/**
 * The Figma rock box is narrower than its ring, but the design's rock art bleeds
 * past the outline on every side. The flat fallback fills a box scaled by this
 * so it overflows the ring like the mock; the 3D rocks use each unit's `size`.
 */
export const ROCK_SCALE = 1.34;

/**
 * Reveal choreography — shared by the 3D rocks (canvas) and the DOM rings so
 * they stay in lockstep across the two render systems. The rocks FLY IN from
 * off-screen: each starts at base × `flyFactor` (well outside the viewport,
 * along its own outward radial → the four arrive from four directions) and eases
 * to its home position over `flyDur`, staggered by `flyStagger`. Once a rock
 * lands, its ring draws in around it (`ringDelay` = that rock's landing time).
 * Both sides start from ONE shared signal (testimonials-reveal.ts), so identical
 * timing here === visual sync.
 *
 * These are the tunable knobs: `flyFactor` sets how far off-screen (and thus how
 * much on-screen travel you see — smaller = the rock enters closer to home);
 * `flyEase`/`flyDur` shape the landing.
 */
export const REVEAL = {
  /** Rock fly-in start position = base × flyFactor (off-screen), tween → base. */
  flyFactor: 3.5,
  flyDur: 0.85,
  flyEase: "power3.out",
  flyStagger: 0.08,
  ringDur: 0.5,
  ringEase: "back.out(1.8)",
  /** When rock i launches, relative to the shared reveal start (secs). */
  flyDelay: (i: number) => REVEAL.flyStagger * i,
  /** When ring i draws in — just after rock i lands. */
  ringDelay: (i: number) => REVEAL.flyDelay(i) + REVEAL.flyDur + 0.05,
} as const;

export type Unit = {
  /** Shared centre of the rock + ring, in the group's px space. */
  cx: number;
  cy: number;
  /**
   * Below md the 1239px group is ~3× the phone width, so the four rocks are
   * re-anchored to frame the (independently reflowed) portrait quote: `mx`/`my`
   * are the unit's mobile centre as CSS lengths relative to the section-filling
   * block (percent → robust across phone sizes), and `ms` scales the whole unit
   * (rock + ring) down so it reads as a corner accent. Switched in under md via
   * CSS vars (testimonials.tsx / testimonial-rocks.tsx), the pills-data pattern —
   * both the rock and its ring read the same trio so they stay concentric.
   */
  mx: string;
  my: string;
  ms: number;
  /** Rock's on-screen footprint (px) — sized to overflow the ring. */
  size: number;
  rock: { w: number; h: number; rotate: number };
  ring: { r: number; stroke: number };
  /** Dot offset from the centre + its radius. */
  dot: { dx: number; dy: number; r: number };
};

export const UNITS: Unit[] = [
  {
    cx: 152.999,
    cy: 101,
    mx: "18%",
    my: "18%",
    ms: 0.5,
    size: 200,
    rock: { w: 136.844, h: 168.309, rotate: 60 },
    ring: { r: 73.5, stroke: 1 },
    dot: { dx: 49, dy: -78, r: 6 },
  }, // 0 · large · top-left
  {
    cx: 1133.8,
    cy: 487.555,
    mx: "82%",
    my: "82%",
    ms: 0.5,
    size: 200,
    rock: { w: 136.844, h: 168.309, rotate: 135 },
    ring: { r: 73.5, stroke: 1 },
    dot: { dx: -71, dy: -68, r: 6 },
  }, // 1 · large · bottom-right
  {
    cx: 1179.72,
    cy: 54.7432,
    mx: "84%",
    my: "14%",
    ms: 0.8,
    size: 90,
    rock: { w: 59.472, h: 73.147, rotate: 135 },
    ring: { r: 31.9429, stroke: 0.434597 },
    dot: { dx: -30.86, dy: -29.5526, r: 2.60758 },
  }, // 2 · small · top-right
  {
    cx: 62.198,
    cy: 487.926,
    mx: "16%",
    my: "86%",
    ms: 0.8,
    size: 116,
    rock: { w: 77.517, h: 95.341, rotate: 135 },
    ring: { r: 41.6349, stroke: 0.566462 },
    dot: { dx: 13.7814, dy: -38.519, r: 3.39877 },
  }, // 3 · small · bottom-left
];

export type QuoteSegment = {
  text: string;
  /** Render this run in the Instrument Serif accent face. */
  serif?: boolean;
};

export type Testimonial = {
  id: string;
  quote: QuoteSegment[];
  /**
   * Who said it. Set ONLY on genuinely attributable quotes — the placeholder
   * entries below deliberately leave it undefined, so an invented quote can
   * never appear under a real person's name. The reveal driver blanks the
   * attribution node when this is absent (testimonials-quote-reveal.tsx).
   */
  attribution?: string;
};

/** Seconds each quote holds before cycling to the next (quote-reveal driver). */
export const QUOTE_CYCLE_SECS = 4;

/**
 * The rotating pull-quotes. SSR renders [0]; the quote-reveal driver then
 * cycles through the rest every QUOTE_CYCLE_SECS with the shared word-by-word
 * blur-rise. Varied lengths on purpose (one-liners to three-liners) so the
 * rotation doesn't read as a template.
 */
// ⚠️ MIXED PROVENANCE — read this before touching the list.
//
// TESTIMONIALS[0] is REAL: it is the one client quote KiwiKoru actually
// publishes, from the WordPress front page (wp_posts ID 23), attributed to
// Sarah Jenkins, CTO. It is reproduced VERBATIM — not lowercased into the house
// voice like the rest of the site's copy, because altering the words of a real
// quotation misrepresents the person who said it. It sits first so it is the
// entry SSR renders (testimonials.tsx uses TESTIMONIALS[0]).
//
// ⚠️⚠️ EVERY OTHER ENTRY IS INVENTED. They carry no `attribution` precisely so
// they can never appear under a real name, but they are still fabricated client
// feedback. Replace them with permissioned quotes before launch, or trim the
// list to the real one — a rotation of one is fine, it simply stops cycling.
//
// The cycler and QUOTE_CYCLE_SECS were tuned against a set of this size, and
// lengths are deliberately varied so the rotation doesn't read as a template.
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "peace-of-mind",
    attribution: "Sarah Jenkins, CTO",
    quote: [
      { text: "“We were struggling with server downtime and high costs until we found Kiwikoru. Their team didn’t just fix our infrastructure; they " },
      { text: "completely transformed it", serif: true },
      { text: ". I finally have peace of mind knowing our AWS environment is in expert hands.”" },
    ],
  },
  {
    id: "bill-halved",
    quote: [
      { text: "“they halved our aws bill in the first quarter, and we " },
      { text: "didn’t lose a thing", serif: true },
      { text: ".”" },
    ],
  },
  {
    id: "migration-boring",
    quote: [
      { text: "“the migration was the most " },
      { text: "boring weekend", serif: true },
      { text: " of my career. that’s the highest praise i have.”" },
    ],
  },
  {
    id: "stopped-firefighting",
    quote: [
      { text: "“we stopped firefighting at 2am. the alerts still happen, they’re just " },
      { text: "someone else’s problem now", serif: true },
      { text: ".”" },
    ],
  },
  {
    id: "knew-our-stack",
    quote: [
      { text: "“the same two engineers every time. by month three they " },
      { text: "knew our stack", serif: true },
      { text: " better than we did.”" },
    ],
  },
  {
    id: "audit-passed",
    quote: [
      { text: "“we passed our first security audit " },
      { text: "without a single finding", serif: true },
      { text: ".”" },
    ],
  },
  {
    id: "no-lock-in",
    quote: [
      { text: "“everything came with terraform we own. no black box, " },
      { text: "no hostage situation", serif: true },
      { text: ".”" },
    ],
  },
  {
    id: "scaled-black-friday",
    quote: [
      { text: "“black friday tripled our traffic and the infrastructure " },
      { text: "just absorbed it", serif: true },
      { text: ". nobody even messaged me.”" },
    ],
  },
  {
    id: "plan-first",
    quote: [
      { text: "“they turned up with a costed plan, not a " },
      { text: "sales deck", serif: true },
      { text: ".”" },
    ],
  },
];
