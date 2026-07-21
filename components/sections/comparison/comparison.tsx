import BrandAura from "./brand-aura";
import ComparisonReveal from "./comparison-reveal";
import { CheckMark, Dash } from "./comparison-icons";
import {
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  type ComparisonCell,
} from "./comparison-data";

/**
 * "comparisonSection" — Figma frame 420:412 (1512×982).
 *
 * A mixed-font heading + supporting line (node 469:550, frame-centred at top:85)
 * above a glass card (node 469:553, frame-centred at top:296) holding a 6×5
 * feature matrix (kiwikoru vs. in-house / consultancy / freelance devops / managed hosting). The
 * two are 211px apart (85→296) and the pair sits centred in the frame; we
 * reproduce that as one viewport-centred 812×1360 block. Like the other sections
 * it renders at DESIGN SCALE (fixed px, centre-anchored) and stays TRANSPARENT
 * over the shared sky — the fixed <Background/> (fill → grain → clouds) shows
 * through, so the Figma mockup's own #62abff fill + grain are intentionally NOT
 * reproduced here.
 *
 * The matrix is a CSS grid whose column/row tracks are the exact Figma pixel
 * gaps, so the row hairlines land where the design draws them (as cell top
 * borders). The column dividers are separate overlay lines because the design
 * insets them 13.5px from the top edge (Figma Line223), which a cell border
 * can't do. The featured "kiwikoru" column gets a highlighted panel behind the
 * grid (node 469:554) whose edges serve as its own two dividers. Card glass
 * matches the house convention
 * (see cards/card-shell.tsx): 1.5px white/30 edge, black 10→5 gradient, and
 * the white inset veil in place of backdrop-blur (frost-swept 2026-07-18 —
 * this panel was the page's single largest frost, 1360×601 re-rastered per
 * scrolled frame over a sky-only backdrop; docs/backdrop-filter-sweep.md).
 */

// The design width the matrix was authored against (Figma 469:553). Every
// horizontal measurement below is expressed as a FRACTION of this, so the card
// can be any width and still reproduce the design exactly at 1360px.
const CARD_W = 1360;

// Column-divider x-positions (Figma Line223), for the three right-hand columns
// only: consultancy | freelance | hosting left edges. The label|kiwikoru and
// kiwikoru|in-house dividers are the highlight panel's own left/right edges.
//
// ⚠️ These are overlay lines, NOT grid children — nothing keeps them in step
// with the column tracks automatically. They are emitted as PERCENTAGES of the
// card width so they track the proportional grid below; if you ever change a
// track, recompute these from the same numbers or the hairlines will drift off
// the column boundaries as the card narrows.
const DIVIDER_X = [713.5, 899.5, 1111.5];

/** A design-space x (in 1360-space) as a percentage of the card width. */
const pct = (x: number) => `${(x / CARD_W) * 100}%`;

function CellContent({ cell }: { cell: ComparisonCell }) {
  if (cell === "check") return <CheckMark className="h-[30px] w-[30px]" />;
  if (cell === "dash") return <Dash className="h-[24px] w-[24px]" />;
  return <span className="text-[20px] leading-normal text-white/50">{cell}</span>;
}

/** The same cell, sized for the mobile stack's option rows (right-aligned). */
function MobileCell({ cell }: { cell: ComparisonCell }) {
  if (cell === "check")
    return <CheckMark className="h-[22px] w-[22px] shrink-0" />;
  if (cell === "dash") return <Dash className="h-[18px] w-[18px] shrink-0" />;
  return <span className="text-right text-body text-white/50">{cell}</span>;
}

export default function Comparison() {
  return (
    <section
      data-comparison
      // Desktop is CONTENT-DRIVEN (no min-h-dvh) with viewport-proportional
      // padding: 25dvh per side reproduces the breathing room of the
      // full-screen tagline/cards sections (~25vh of air each side), so the
      // rhythm SCALES with the viewport like they do — spacious on 2K, tighter
      // on a laptop — while staying CONSISTENT across sections regardless of
      // their content height (a fixed viewport section made sparse content float
      // in far more air than dense content). Mobile keeps its full-height layout
      // (max-md:min-h-dvh) + its own padding, untouched.
      className="relative flex max-md:min-h-dvh w-full items-center justify-center overflow-hidden px-6 py-[25dvh] max-md:py-[12dvh]"
    >
      {/* Content block (Figma 469:646, 812×1360), flow-centred so a viewport
          shorter than the block grows the section (page scrolls) instead of
          clipping it. Header and card are pinned inside (top:0 / top:211) rather
          than flow-spaced, matching the design's explicit positions.
          CAPPED-FLUID: resolves to exactly 1360px when there's room, shrinks
          below instead of centre-cropping. Everything inside the matrix is
          proportional (see the grid + DIVIDER_X), so the whole composition
          scales with this box down to the lg breakpoint, where the stack takes
          over. Gutter is on the section — border-box, see faq.tsx. */}
      <div className="relative h-[812px] w-full max-w-[1360px] max-lg:h-auto max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-[32px]">
        {/* Word-by-word blur reveal on the heading (see comparison-reveal.tsx). */}
        <ComparisonReveal />
        {/* Heading + supporting copy (469:550), pinned to the top and centred. */}
        <div className="absolute left-1/2 top-0 flex w-[628px] max-w-full -translate-x-1/2 flex-col items-center gap-[25px] text-center text-white max-lg:static max-lg:w-full max-lg:translate-x-0 max-lg:gap-[18px]">
          <h2
            data-comparison-head
            className="text-display leading-[1.1] tracking-[-0.03em]"
          >
            <span className="block whitespace-nowrap font-light max-lg:whitespace-normal">
              hire, outsource, or wing it?
            </span>
            <span className="block font-instrument">none of the above.</span>
          </h2>
          <p
            data-comparison-sub
            className="w-[567px] max-w-full text-body leading-normal tracking-[0.02em] max-lg:w-full"
          >
            hiring a cloud engineer takes months. consultancies scope for a
            quarter. hosting support closes your ticket. there&rsquo;s a fourth
            option.
          </p>
        </div>

        {/* Glass matrix card (469:553), pinned at top:211. NOT overflow-clip:
            the featured column spans the full card height and its rainbow glow
            must bloom past the top/bottom edges (a clip would chop it into a
            broken loop). The grid fills the card edge-to-edge with no content in
            the rounded corners, so nothing else needs clipping. */}
        <div
          data-comparison-card
          className="absolute left-0 top-[211px] h-[601px] w-full rounded-[20px] border-[1.5px] border-solid border-white/30 bg-gradient-to-b from-black/10 to-black/5 shadow-[inset_0_0_0_999px_rgba(255,255,255,0.06)] max-lg:hidden"
        >
          {/* Featured-column highlight (469:554): a brighter panel behind the
              grid over the "kiwikoru" track, at full card height, wearing the
              siri-style rainbow aura (same effect as the CTA button's hover
              ring). The card is not clipped, so its glowing border is a
              continuous loop on all four sides. */}
          <BrandAura />

          {/* Column dividers (Figma Line223): inset 13.5px from the top edge,
              unlike the full-height kiwikoru highlight border. */}
          {DIVIDER_X.map((x) => (
            <div
              key={x}
              aria-hidden
              className="pointer-events-none absolute bottom-0 top-[13.5px] z-0 w-px bg-white/10"
              style={{ left: pct(x) }}
            />
          ))}

          {/* The matrix. Column tracks are the exact Figma pixel gaps expressed
              as `fr` RATIOS rather than px: the numbers are unchanged (302.5,
              174, … sum to 1360), so at a 1360px card each track resolves to
              precisely its design width — but the grid now fills whatever width
              the card has, instead of overflowing a narrower one.
              `minmax(0,…)` is load-bearing: a bare `Nfr` track still floors at
              its content's min-content width, so a long cell string ("managed
              hosting") would refuse to shrink and push the grid wider than the
              card. The explicit 0 floor lets text wrap instead.
              Row tracks stay in px — vertical space is not the constraint. */}
          <div className="relative z-10 grid h-full w-full grid-cols-[minmax(0,302.5fr)_minmax(0,174fr)_minmax(0,237fr)_minmax(0,186fr)_minmax(0,212fr)_minmax(0,248.5fr)] grid-rows-[80.5px_81px_80px_88px_88px_88px_95.5px]">
            {/* Header row: empty label cell, then the column names. */}
            <div />
            {COMPARISON_COLUMNS.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center"
              >
                <span className="text-[20px] font-bold leading-normal text-white">
                  {name}
                </span>
              </div>
            ))}

            {/* Data rows. */}
            {COMPARISON_ROWS.map((row) => (
              <Row key={row.label} label={row.label} cells={row.cells} />
            ))}
          </div>
        </div>

        {/* ── Stacked matrix (below lg) ────────────────────────────────────
            The wide grid can't shrink indefinitely (long text cells across 6
            tracks), so the matrix is rebuilt as one glass card per feature, each
            listing all five options with kiwikoru featured on top. The desktop card
            above is max-lg:hidden; this is hidden max-lg:flex. Carries
            data-comparison-card so the reveal blur-rises it too.
            The boundary is `lg` (1024), NOT `md`: the proportional grid above
            stays legible down to about there, but at iPad-portrait width the six
            columns squeeze the text to unreadable ribbons. This stack — already
            built for phones — is simply the better layout for a narrow tablet
            too, so it takes over earlier. */}
        <div
          data-comparison-card
          className="hidden w-full max-w-[520px] flex-col gap-[16px] max-lg:flex"
        >
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.label}
              className="rounded-[20px] border-[1.5px] border-solid border-white/30 bg-gradient-to-b from-black/10 to-black/5 p-[20px] shadow-[inset_0_0_0_999px_rgba(255,255,255,0.06)]"
            >
              <h3 className="mb-[14px] text-body-lg font-bold leading-normal text-white">
                {row.label}
              </h3>
              <ul className="flex flex-col gap-[2px]">
                {COMPARISON_COLUMNS.map((col, i) => {
                  const featured = i === 0;
                  return (
                    <li
                      key={col}
                      className={`flex items-center justify-between gap-[16px] rounded-[10px] px-[12px] py-[9px] ${
                        featured ? "bg-white/10" : ""
                      }`}
                    >
                      <span
                        className={`text-body ${
                          featured
                            ? "font-medium text-white"
                            : "font-light text-white/60"
                        }`}
                      >
                        {col}
                      </span>
                      <MobileCell cell={row.cells[i]} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  cells,
}: {
  label: string;
  cells: readonly ComparisonCell[];
}) {
  return (
    <>
      <div className="flex items-center border-t border-white/10 pl-[34.5px]">
        <span className="text-[20px] font-bold leading-normal text-white">
          {label}
        </span>
      </div>
      {cells.map((cell, colIndex) => (
        <div
          key={colIndex}
          className="flex items-center justify-center border-t border-white/10"
        >
          <CellContent cell={cell} />
        </div>
      ))}
    </>
  );
}
