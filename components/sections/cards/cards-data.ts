/**
 * Content + layout specs for the "AimatedCards" section (Figma node 220:1418).
 * Kept data-driven so the inner mockups can be looped/animated later (the cards
 * carry auto-running infinite animations — see request rows + shot grid).
 *
 * All numbers are the raw Figma px off the 1512×982 design frame; the section
 * renders at design scale, centered, matching the hero's convention.
 */

// PLACEHOLDER COPY — reframed from the design's subscribe/request/receive flow
// into an assess → migrate → manage engagement. KiwiKoru publishes no process
// content, so the specifics (the "about an hour", the wave cadence) are authored
// and need client sign-off.
//
// NOTE: the three object KEYS are structural — card-shell/cards.tsx and the
// three *-media.tsx mockups key off them. Only the values are copy.
export const CARD_COPY = {
  subscribe: "book a review. we audit your accounts and hand back a costed migration plan.",
  request: "we move you in waves. each workload gets a runbook, a window, and a rollback path.",
  receive: "then we run it. 24/7 monitoring, monthly cost reviews, and patching you never think about.",
} as const;

/** The request board rows (Card2, Figma 140:13791). The first is the ACTIVE
 *  row — it expands and types out the brief — the rest are the queue below. */
export const ACTIVE_REQUEST = { task: "migrate prod database", tag: "RDS" } as const;
export const REQUEST_QUEUE = [
  { task: "set up landing zone", tag: "Infra" },
  { task: "right-size ec2 fleet", tag: "Cost" },
  { task: "terraform the vpc", tag: "IaC" },
  { task: "wire up cloudwatch alarms", tag: "Ops" },
] as const;

export type ShotTile = {
  src: string;
  alt: string;
  /** Rect within the 594×510 grid plane (Card1). This is the OUTER glass-frame
   *  rect (Figma tile frame) — the shot itself sits inside it, inset by `pad`. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Glass frame (Figma tile-frame nodes 348:303 / 392 / 761 / 910): each shot
   *  sits in a translucent-white mat with a 0.5px white edge and a soft backdrop
   *  blur. `pad` = mat width, `r` = outer radius, `ri` = inner shot radius,
   *  `blur` = backdrop-blur radius — all raw Figma px on the 594×510 plane. */
  pad: number;
  r: number;
  ri: number;
  blur: number;
};

/** Card1 "receive" design-shot collage — 4 tiles in a 594×510 plane. The PNGs
 *  are the CLEAN inner-shot exports (Figma nodes 348:304 / 393 / 762 / 911) —
 *  the shots WITHOUT the tile's frame. The earlier .avif set was exported from
 *  the outer frame node, which baked the frame's translucent mat AND the node's
 *  rounded corners (both flattened over the artboard sky) into the image as a
 *  stray blue edge. These are cropped ~18px in from the export so those
 *  flattened-sky corners are gone entirely — clean opaque rectangles.
 *  receive-media.tsx re-creates the tile's translucent-glass frame around each
 *  shot in CSS (the `pad`/`r`/`ri`/`blur` metrics below), so the design's glass
 *  border is back WITHOUT baking the sky into the pixels. */
export const SHOT_TILES: ShotTile[] = [
  { src: "/cards/shot-finance.png", alt: "Fintech dashboard concept", x: 0, y: 0, w: 295, h: 224, pad: 5.23, r: 11.5, ri: 7.12, blur: 2.09 },
  { src: "/cards/shot-weightloss.png", alt: "Health app landing page", x: 1, y: 233, w: 294, h: 277, pad: 5.23, r: 11.5, ri: 6.54, blur: 2.09 },
  { src: "/cards/shot-collage.png", alt: "Eyewear brand photography", x: 307, y: 49, w: 250, h: 234, pad: 5.39, r: 11.85, ri: 7.72, blur: 2.16 },
  { src: "/cards/shot-taskma.png", alt: "Task manager web app", x: 306, y: 290, w: 288, h: 207, pad: 4.85, r: 10.66, ri: 3.49, blur: 1.94 },
];
