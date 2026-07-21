import type { Metadata } from "next";
import ContactCard from "@/components/sections/contact-card/contact-card";
import FinalCta from "@/components/sections/final-cta/final-cta";
import PageHeader from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "contact — kiwikoru",
  description:
    "Talk to KiwiKoru — info@kiwikoru.com, +64 21 0816 2162, or book a 15-minute cloud review. Weymouth, Auckland.",
};

/**
 * /contact — real contact details, then the closing call-to-action.
 *
 * The details in <ContactCard/> are KiwiKoru's own, from the WordPress page body
 * (an earlier pass of this project wrongly concluded they had none, because the
 * `admin_email` option is the untouched Bitnami default — see contact-card.tsx).
 *
 * Still outstanding: the CTA buttons in <FinalCta/> are unwired real <button>s.
 * "book a 15-min cloud review" needs a Cal.com booking link behind it — see
 * CLAUDE.md's Stripe / Cal.com note for where that integration belongs.
 */
export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="contact"
        sub="tell us what you're running and where it hurts. we'll come back with a plan, not a sales deck."
      />
      <ContactCard />
      <FinalCta />
    </>
  );
}
