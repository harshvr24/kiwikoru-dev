import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * A titled glass panel — the content-grid workhorse for the inner pages
 * (`/services` service list, `/why-us` pillars, `/contact` details).
 *
 * Uses the site's ONE glass recipe, identical to card-shell.tsx / faq.tsx /
 * pills.tsx: 1.5px white/30 edge, faint top→bottom dark gradient, and the white
 * inset veil. Unlike card-shell.tsx (a fixed 440×438 panel with absolutely
 * positioned text over media), this one is flow-sized, so it works in a
 * responsive grid and grows with its copy.
 *
 * ⚠️ NO `backdrop-blur` — see docs/backdrop-filter-sweep.md. These sit over the
 * fixed sky, where frost costs a full backdrop re-raster per scrolled frame and
 * returns the same gradient. The inset veil replaces the lift it used to give.
 *
 * ⚠️ NO `data-reveal-*` hooks — those only work on the home page. Pair with
 * <RevealOnScroll> for an entrance.
 */
export default function GlassCard({
  title,
  children,
  className = "",
  ...rest
}: {
  title: string;
  children: ReactNode;
  className?: string;
  /** Extra attributes land on the <article> — e.g. the data-* hook a
   *  <RevealOnScroll> selector targets. */
} & Omit<ComponentPropsWithoutRef<"article">, "title" | "children">) {
  return (
    <article
      {...rest}
      className={`flex flex-col gap-[14px] rounded-[20px] border-[1.5px] border-solid border-white/30 bg-gradient-to-b from-black/10 to-black/5 p-[28px] shadow-[inset_0_0_0_999px_rgba(255,255,255,0.06)] ${className}`}
    >
      <h3 className="font-product text-[31px] font-normal leading-[1.1] tracking-[-0.03em] text-white max-md:text-[26px]">
        {title}
      </h3>
      <div className="font-product text-body font-light leading-[1.45] text-white/70">
        {children}
      </div>
    </article>
  );
}
