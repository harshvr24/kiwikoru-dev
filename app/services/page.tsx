import type { Metadata } from "next";
import Faq from "@/components/sections/faq/faq";
import Pills from "@/components/sections/pills/pills";
import Pricing from "@/components/sections/pricing/pricing";
import ServiceList from "@/components/sections/service-list/service-list";
import PageHeader from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "services — kiwikoru",
  description:
    "AWS consulting, cloud migration, infrastructure management, app development and AWS governance — with 24/7 monitoring.",
};

/**
 * /services — the capability field, pricing and FAQ.
 *
 * Sections are the SAME components the home page composes; they render at design
 * scale, transparent over the global fixed sky (<Background/> + clouds mounted in
 * layout.tsx), so they stack here unchanged. No <Intro>/<Hero> on this route —
 * the welcome is home-only (see intro-state.ts).
 */
export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="services"
        sub="six things we do on aws — from the first architecture call through to the 3am page nobody wants."
      />
      {/* KiwiKoru's own six service descriptions (real copy). */}
      <ServiceList />
      <Pills />
      <Pricing />
      <Faq />
    </>
  );
}
