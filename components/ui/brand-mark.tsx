import type { SVGProps } from "react";

/**
 * KiwiKoru brand mark — a cloud with a kiwi in negative space.
 *
 * Replaces the inherited double-chevron (`logo.tsx`, deleted), and is rendered
 * in `currentColor` exactly like the chevron was: flat white in the intro loader
 * and in the nav pill. The source artwork is orange, but the mark is used
 * monochrome throughout — do NOT reintroduce the gradient here; a coloured mark
 * would break the loader's white-on-sky look and the glass pill's monochrome
 * chrome.
 *
 * ── Provenance ────────────────────────────────────────────────────────────────
 * Traced from the only supplied artwork:
 *   website-A/…/uploads/2025/12/Gemini_Generated_Image_ornffrornffrornf-removebg-preview.png
 * a 500×500 AI-generated (Gemini) PNG. That file also contains a "KiwiKoru"
 * wordmark band and Gemini's watermark sparkle in the bottom-right; the trace is
 * cropped to the mark alone (source box 108,90–392,290) so NEITHER is included.
 *
 * The kiwi is a TRANSPARENT CUTOUT in the source, not white pixels, so the alpha
 * channel alone carries the whole design — hence a single-colour path works. The
 * kiwi's beak runs out to the cloud's lower-left edge, which splits the cloud
 * into two disjoint lobes; with the eye that makes three subpaths, none nested.
 * `fill-rule="evenodd"` is therefore belt-and-braces rather than load-bearing.
 *
 * Trace verified against the source alpha at 99.72% pixel agreement / 99.56%
 * IoU, with the kiwi cutout confirmed present (a filled-in kiwi is the failure
 * mode to watch for if this is ever re-traced).
 *
 * ⚠️ This is raster art traced to vector, not an authored logo. If KiwiKoru
 * supplies a real vector mark, replace the path below — nothing else in this
 * file is specific to the artwork.
 *
 * viewBox is offset by 1 because the bitmap was padded before tracing: a shape
 * flush to the bitmap edge makes potrace emit a canvas-sized outer contour,
 * which inverts the mark under evenodd. The offset removes the pad again, so the
 * artwork sits flush in user units and the 284×200 (1.42:1) box is exact.
 *
 * Uses `currentColor`, so colour follows the surrounding text colour. Callers
 * must size it on ONE axis (`w-*`) — it is not square, so `size-*` letterboxes.
 */
export default function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="1 1 284 200"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M59.5,198.98 C41.45,196.21 22.62,183.73 12.75,168 C-3.99,141.3 -0.24,107.67 22,85.08 C31.51,75.42 43.22,68.86 56,66.04 C64.68,64.12 65,63.98 65,61.89 C65,56.21 68.57,43.59 72.31,36.04 C82.62,15.24 103.67,2 126.45,2 C151.45,2 170.92,14.04 182.28,36.54 C184.96,41.86 188.49,52.84 187.75,53.58 C187.51,53.82 184.52,52.58 181.1,50.81 C175.83,48.1 173.56,47.55 166.05,47.19 C154.93,46.66 146.65,49.15 138,55.66 C133.11,59.34 131.37,61.49 128.31,67.68 C125,74.39 124.54,76.25 124.2,84.36 C123.9,91.25 124.23,94.61 125.5,98 C128.83,106.86 128.93,106.5 118.71,121.56 C108.42,136.73 97.26,154.65 84.49,176.5 C71.81,198.2 71.65,198.46 70.54,199.23 C69.31,200.1 66.34,200.03 59.5,198.98 Z M75.33,198.58 C75.98,196.89 103.97,161.21 111.88,152 C123.46,138.5 144.21,116.13 145.66,115.58 C146.49,115.26 148.4,115 149.9,115 C154.49,115 162.44,112.18 166.83,109.01 C172.89,104.62 176.48,99.06 179.96,88.68 C184.04,76.48 186.55,72.31 192.51,67.76 C199.42,62.49 206.39,60.54 218,60.61 C247.81,60.8 272.71,80.5 281.12,110.55 C284.38,122.18 284.22,139.51 280.76,150.17 C276.96,161.85 271.62,170.56 263.09,179 C250.89,191.06 238.5,197.12 222.23,198.98 C217.23,199.56 183.83,199.99 144.14,199.99 C84.72,200 74.86,199.8 75.33,198.58 Z M149.23,91.33 C147.08,90.46 144.91,85.2 145.59,82.49 C146.33,79.57 150.45,76 153.09,76 C159.13,76 163.2,81.69 160.98,87.04 C160.29,88.71 158.92,90.51 157.93,91.04 C156.04,92.05 151.4,92.2 149.23,91.33 Z"
      />
    </svg>
  );
}
