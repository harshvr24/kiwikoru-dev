/**
 * "comparisonSection" data — Figma node 469:549 (frame 420:412, 1512×982).
 *
 * A 6-row × 5-column feature matrix comparing kiwikoru against the alternatives.
 * The first data column ("kiwikoru") is the featured option — every cell is a
 * check, and it's rendered with a highlighted panel in comparison.tsx.
 *
 * A cell is one of:
 *   • "check" — the two-tone tick glyph (feature fully covered)
 *   • "dash"  — the two-tone minus glyph (not covered)
 *   • string  — a muted qualifier ("months to start", "varies", …)
 */

/** Column headers, in render order. `kiwikoru` is the featured (highlighted) one. */
export const COMPARISON_COLUMNS = [
  "kiwikoru",
  "in-house team",
  "big consultancy",
  "freelance devops",
  "managed hosting",
] as const;

export type ComparisonCell = "check" | "dash" | (string & {});

export interface ComparisonRow {
  /** Row label, left-aligned in the first column. */
  readonly label: string;
  /** One cell per column in COMPARISON_COLUMNS order. */
  readonly cells: readonly [
    ComparisonCell,
    ComparisonCell,
    ComparisonCell,
    ComparisonCell,
    ComparisonCell,
  ];
}

// PLACEHOLDER COPY — the row labels and competitor cells below are authored, not
// sourced from KiwiKoru. The WordPress site has no comparison content at all, so
// these are a plausible AWS-consulting matrix in the house voice. Have the client
// confirm each claim before this ships.
export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  {
    label: "time to first migration",
    cells: ["check", "months to hire", "weeks of scoping", "check", "n/a"],
  },
  {
    label: "aws certified engineers",
    cells: ["check", "varies", "check", "lottery", "dash"],
  },
  {
    label: "24/7 monitoring included",
    cells: ["check", "on-call rota", "extra retainer", "dash", "check"],
  },
  {
    label: "actively cuts your bill",
    cells: ["check", "check", "dash", "sometimes", "dash"],
  },
  {
    label: "one team that knows your stack",
    cells: ["check", "check", "rotating", "solo", "ticket queue"],
  },
  {
    label: "predictable cost",
    cells: ["check", "salary + benefits", "scope creep", "hourly drift", "check"],
  },
];
