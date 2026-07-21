/**
 * CloudCanvas project registry — the single place you author the portfolio set.
 *
 * Each entry is one project tile on the globe. You control, per project:
 *   • `form` — which tile slot it renders in (landscape / square / portrait).
 *     Honoured when the config's layout is "manual" (the shipped portfolio
 *     preset). Images are cover-cropped into the slot, so any form works for
 *     any image — pick whatever frames the shot best.
 *   • `type` — which filter tab it belongs to (migration / managed / build). The
 *     section's tabs filter the globe by this; "all" shows everything.
 *   • `name` — shown in the focus/hover label (added in a later pass).
 *
 * The images live in public/portfolio/cloud/ (≤900px WebP). Keep filenames
 * URL-clean (no spaces). Order here is the order tiles are laid onto the
 * formation — reorder entries to reshuffle neighbours.
 *
 * ⚠️ PLACEHOLDER: every field here is stand-in data. The IMAGES are still the
 * Figma "Startup" collage stills (they show web/brand design work, not cloud
 * infrastructure — they do not represent KiwiKoru projects). The NAMES are
 * deliberately left as "Project NN" rather than invented client names, so
 * nothing reads as a real engagement that isn't one. The `type` buckets were
 * re-labelled to KiwiKoru's service lines but assigned arbitrarily.
 *
 * Replace all three together with real, permissioned case studies. Until then
 * this section is a layout demo, not a portfolio.
 */

export type ProjectType = "migration" | "managed" | "build";
export type ProjectForm = "landscape" | "square" | "portrait";
/** A filter tab value: a project type, or "all" (the default tab). */
export type CloudFilter = ProjectType | "all";

export interface CloudProject {
  src: string;
  /** Shown in the focus/hover label (added in a later pass). */
  name: string;
  /** Filter-tab bucket. */
  type: ProjectType;
  /** Tile slot shape — used when the config's layout is "manual". */
  form: ProjectForm;
}

/** The filter tabs, in display order. Labels are UI copy (house lowercase). */
export const PROJECT_FILTERS: { value: CloudFilter; label: string }[] = [
  { value: "all", label: "all" },
  { value: "migration", label: "migrations" },
  { value: "managed", label: "managed" },
  { value: "build", label: "app builds" },
];

const dir = "/portfolio/cloud";

export const cloudProjects: CloudProject[] = [
  { src: `${dir}/cloud-01.webp`, name: "Project 01", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-02.webp`, name: "Project 02", type: "managed", form: "portrait" },
  { src: `${dir}/cloud-03.webp`, name: "Project 03", type: "managed", form: "square" },
  { src: `${dir}/cloud-04.webp`, name: "Project 04", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-05.webp`, name: "Project 05", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-06.webp`, name: "Project 06", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-07.webp`, name: "Project 07", type: "build", form: "portrait" },
  { src: `${dir}/cloud-08.webp`, name: "Project 08", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-09.webp`, name: "Project 09", type: "managed", form: "square" },
  { src: `${dir}/cloud-10.webp`, name: "Project 10", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-11.webp`, name: "Project 11", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-12.webp`, name: "Project 12", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-13.webp`, name: "Project 13", type: "managed", form: "portrait" },
  { src: `${dir}/cloud-14.webp`, name: "Project 14", type: "managed", form: "portrait" },
  { src: `${dir}/cloud-15.webp`, name: "Project 15", type: "build", form: "portrait" },
  { src: `${dir}/cloud-16.webp`, name: "Project 16", type: "build", form: "portrait" },
  { src: `${dir}/cloud-17.webp`, name: "Project 17", type: "managed", form: "square" },
  { src: `${dir}/cloud-18.webp`, name: "Project 18", type: "build", form: "portrait" },
  { src: `${dir}/cloud-19.webp`, name: "Project 19", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-20.webp`, name: "Project 20", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-21.webp`, name: "Project 21", type: "managed", form: "portrait" },
  { src: `${dir}/cloud-22.webp`, name: "Project 22", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-23.webp`, name: "Project 23", type: "managed", form: "square" },
  { src: `${dir}/cloud-24.webp`, name: "Project 24", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-25.webp`, name: "Project 25", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-26.webp`, name: "Project 26", type: "migration", form: "landscape" },
  { src: `${dir}/cloud-27.webp`, name: "Project 27", type: "build", form: "square" },
  { src: `${dir}/cloud-28.webp`, name: "Project 28", type: "build", form: "portrait" },
];
