import GlassCard from "@/components/ui/glass-card";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";

/**
 * KiwiKoru's three "Why Choose Us" pillars — the substance of `/why-us`.
 *
 * ✅ REAL CONTENT. These are KiwiKoru's own three pillars and their own
 * descriptions, from the WordPress front page (wp_posts ID 23, "Why Choose Us"),
 * rewritten into the site's lowercase voice. The claims are theirs — "certified
 * experts", "enterprise-grade", "24/7" — so don't embellish them.
 *
 * The same three words drive the pinned reel further down the page
 * (why-stay-data.ts PHRASES); this block is where they're actually explained.
 *
 * Transparent over the shared fixed sky, flow-sized. No Figma node — the ascnd
 * design had no slot for this copy.
 */
const PILLARS = [
  {
    name: "passionate",
    body: "cloud technology isn't just our job, it's our obsession. we treat your infrastructure with fierce dedication, sweating the small details so you never have to — from the first line of code to the final migration.",
  },
  {
    name: "professional",
    body: "enterprise-grade aws solutions tailored to your business. our certified experts keep your cloud secure, scalable and optimised for peak performance, so you can focus on innovation while we handle the technical complexity.",
  },
  {
    name: "24/7 monitoring",
    body: "our monitoring detects issues before they reach your business — maximum uptime, robust security, and performance kept in tune around the clock.",
  },
] as const;

export default function WhyUsPillars() {
  return (
    <section
      data-why-us-pillars
      className="relative flex w-full justify-center overflow-hidden px-6 pb-[12dvh]"
    >
      <RevealOnScroll selector="[data-pillar-card]" />
      {/* 3-up → 2-up at lg → 1-up on phones. The middle step matters: without it
          an iPad drops straight to a single stretched column. Same ladder as
          service-list.tsx. */}
      <div className="grid w-full max-w-[1146px] grid-cols-3 gap-[20px] max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-[16px]">
        {PILLARS.map((p) => (
          <GlassCard
            key={p.name}
            title={p.name}
            className="h-full"
            data-pillar-card
          >
            {p.body}
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
