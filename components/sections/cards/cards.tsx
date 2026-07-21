import CardShell from "./card-shell";
import CardsHeading from "./cards-heading";
import CardsReveal from "./cards-reveal";
import ReceiveMedia from "./receive-media";
import RequestMedia from "./request-media";
import SubscribeMedia from "./subscribe-media";
import { CARD_COPY } from "./cards-data";

/**
 * "AimatedCards" section — Figma frame 220:1418 (1512×982). A centered row of
 * three glass cards (subscribe · request · receive) over the shared sky. Like
 * the hero, it renders at design scale (fixed px, center-anchored) and stays
 * transparent so the fixed <Background/> + clouds show through.
 *
 * Each card's media is a self-contained component so the auto-running infinite
 * animations (cursor drift, request conveyor, shot-grid scroll) can be layered
 * on next without touching the layout.
 */
export default function Cards() {
  return (
    <section
      data-cards
      className="relative min-h-dvh w-full overflow-hidden max-wide:flex max-wide:flex-col max-wide:items-center max-wide:justify-center max-wide:gap-[40px] max-wide:px-6 max-wide:py-[80px]"
    >
      {/* Section heading (Figma 302:1446): "ground to launch in days" — floats
          303px above the card-row centre. Client component: it blur-reveals word
          by word on scroll-in (see cards-heading.tsx). Below md it un-pins to the
          top of the stack (see cards-heading.tsx). */}
      <CardsHeading />

      {/* Client driver: blur-reveals each glass card (shell + title + media) as
          the row scrolls in, left→right (see cards-reveal.tsx). Renders nothing. */}
      <CardsReveal />

      {/*
        THREE regimes, because a card's media guts are rigidly px-tuned against
        live GSAP and cannot be made fluid (the why-stay "scale, don't rebuild"
        call):

        ≥ wide (1408) — the design: one centred absolute row, 3×440 + 2×20 gaps.
        768 → wide    — the row goes static and WRAPS. The cards keep their exact
                        440px width, so nothing inside them is touched or scaled;
                        they simply re-arrange 3-up → 2-up → 1-up as the viewport
                        narrows. This is real reflow, not shrinking, which is why
                        the media stays legible on an iPad.
        < 768         — the phone stack: one column, each card scaled to fit as a
                        unit (globals.css "Card stack scale"). Below ~488px a
                        440px card no longer fits any other way.

        Each card sits in a [data-card-scale] wrapper: a plain shrink-0 flex item
        until the phone stack, where it becomes the scale carrier. Scale rides the
        WRAPPER, not [data-card-shell], so the article's transform stays free for
        the reveal.
      */}
      <div
        data-cards-row
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-[20px] max-wide:static max-wide:translate-x-0 max-wide:translate-y-0 max-wide:flex-wrap max-wide:justify-center max-md:flex-col max-md:items-center max-md:gap-[24px]"
      >
        {/* The three card TITLES are the visible step labels (assess → migrate →
            manage). The component names and CARD_COPY keys still read
            subscribe/request/receive: those are structural identifiers tied to
            media-gate.ts's CardMediaId union and the three *-media.tsx mockups,
            not copy. Renaming them is a separate refactor; don't half-do it. */}
        <div data-card-scale className="shrink-0">
          <CardShell title="assess" subtitle={CARD_COPY.subscribe}>
            <SubscribeMedia />
          </CardShell>
        </div>
        <div data-card-scale className="shrink-0">
          <CardShell title="migrate" subtitle={CARD_COPY.request}>
            <RequestMedia />
          </CardShell>
        </div>
        <div data-card-scale className="shrink-0">
          <CardShell title="manage" subtitle={CARD_COPY.receive}>
            <ReceiveMedia />
          </CardShell>
        </div>
      </div>
    </section>
  );
}
