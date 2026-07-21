import type { Metadata } from "next";
import Comparison from "@/components/sections/comparison/comparison";
import WhyStay from "@/components/sections/why-stay/why-stay";
import WhyUsPillars from "@/components/sections/why-us-pillars/why-us-pillars";
import PageHeader from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "why us — kiwikoru",
  description:
    "Passionate, professional, and monitoring around the clock — and how that compares to hiring in-house or going to a consultancy.",
};

/** /why-us — the three pillars, the pinned reel, then the feature matrix. */
export default function WhyUsPage() {
  return (
    <>
      <PageHeader
        title="why us"
        sub="three things kiwikoru is built on — and an honest look at the alternatives."
      />
      {/* KiwiKoru's own "Why Choose Us" pillars (real copy). */}
      <WhyUsPillars />
      {/* The `shrink-0` wrapper is REQUIRED, exactly as on the home page.
          <body> is a flex column, and ScrollTrigger cannot add pin-spacing to a
          direct child of a flex container — the flex layout swallows the
          pin-spacer's padding, so the pinned reel gets zero scroll room and the
          page freezes when it reaches this section. The block wrapper gives the
          pin normal block flow to grow into. Don't remove it. */}
      <div className="shrink-0">
        <WhyStay />
      </div>
      <Comparison />
    </>
  );
}
