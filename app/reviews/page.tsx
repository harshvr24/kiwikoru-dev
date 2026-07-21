import type { Metadata } from "next";
import Testimonials from "@/components/sections/testimonials/testimonials";
import PageHeader from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "reviews — kiwikoru",
  description: "What clients say about working with KiwiKoru.",
};

/**
 * /reviews — the rotating pull-quotes, framed by the 3D rocks.
 *
 * The FIRST quote (the one rendered on load) is real and attributed: Sarah
 * Jenkins, CTO, from KiwiKoru's own site, reproduced verbatim.
 *
 * ⚠️ The eight quotes that follow it in the rotation are still PLACEHOLDER —
 * invented to fill the cycle. They deliberately carry no attribution, so none
 * can appear under a real person's name, but they remain fabricated client
 * feedback. On the home page they're one section among fourteen; here they are
 * the whole page. Replace them with permissioned quotes before this route goes
 * public, or trim the list to the real one (a rotation of one simply stops
 * cycling). See testimonials-data.ts and CONTENT-SOURCE.md.
 */
export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        title="reviews"
        sub="what it's like on the other side of a migration."
      />
      <Testimonials />
    </>
  );
}
