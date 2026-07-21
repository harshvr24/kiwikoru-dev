import RevealOnScroll from "@/components/ui/reveal-on-scroll";

/**
 * The KiwiKoru story — the substance of `/about`.
 *
 * ✅ REAL CONTENT. Both the headline and the paragraph are KiwiKoru's own, from
 * the WordPress front page (wp_posts ID 23, the "WE HELP TEAMS BUILD THE
 * BUSINESS OF THEIR DREAMS" block), rewritten into the site's lowercase voice.
 * The company identity line is from the same page's footer block.
 *
 * Mixed-font headline in the house style: Product Sans Light with an Instrument
 * Serif accent word, matching working-with / final-cta / comparison. Transparent
 * over the shared fixed sky.
 */
export default function AboutStory() {
  return (
    <section
      data-about-story
      className="relative flex w-full justify-center overflow-hidden px-6 pb-[14dvh]"
    >
      <RevealOnScroll selector="[data-about-block]" />
      <div className="flex w-full max-w-[820px] flex-col items-center gap-[32px] text-center">
        <h2
          data-about-block
          className="text-display font-light leading-[1.1] tracking-[-0.03em] text-white"
        >
          we help teams build the business of their{" "}
          <span className="font-instrument">dreams</span>
        </h2>

        <p
          data-about-block
          className="max-w-[720px] text-body-lg font-light leading-normal tracking-[0.02em] text-white/70"
        >
          your vision deserves a solid foundation. kiwikoru provides the expert
          guidance and managed services to turn operational challenges into
          growth opportunities — optimising your digital environment so you
          reduce overhead, increase speed, and build a business that stands up
          to whatever comes next.
        </p>

        {/* Company identity. The registered name and address are REAL (same
            source page); keep them exact — see contact-card.tsx, which is the
            canonical place these live. */}
        <div
          data-about-block
          className="flex flex-col items-center gap-[6px] pt-[8px] font-product text-body font-light leading-normal text-white/50"
        >
          <span className="tracking-[0.08em] text-white/70">
            KIWIKORU LIMITED
          </span>
          <span>67 Glenveagh Park Drive, Weymouth, Auckland 2103, NZ</span>
        </div>
      </div>
    </section>
  );
}
