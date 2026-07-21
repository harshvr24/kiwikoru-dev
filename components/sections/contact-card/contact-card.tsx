import GlassCard from "@/components/ui/glass-card";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";

/**
 * KiwiKoru's real contact details — the substance of `/contact`.
 *
 * ✅ REAL CONTENT, and worth stating plainly because an earlier pass of this
 * project got it wrong: the WordPress `admin_email` option is the untouched
 * Bitnami default (user@example.com), which led to the conclusion that KiwiKoru
 * had published no contact details at all. They had — in the PAGE BODY, not the
 * options table (wp_posts ID 23, the "KIWIKORU LIMITED" block). Everything below
 * is theirs, verbatim.
 *
 * ⚠️ Keep these EXACT. Contact details are the one kind of content a visitor
 * acts on directly, so a typo here sends real mail and real calls into a void.
 * The raw phone string in the source is "+642108162162"; it is grouped for
 * display as NZ mobile convention (+64 21 0816 2162) while `tel:` keeps the
 * unformatted E.164 form. Worth having the client confirm the grouping.
 */

const EMAIL = "info@kiwikoru.com";
const PHONE_DISPLAY = "+64 21 0816 2162";
const PHONE_E164 = "+642108162162";
const ADDRESS = "67 Glenveagh Park Drive, Weymouth, Auckland 2103, New Zealand";

export default function ContactCard() {
  return (
    <section
      data-contact-card
      className="relative flex w-full justify-center overflow-hidden px-6 pb-[14dvh]"
    >
      <RevealOnScroll selector="[data-contact-item]" />
      <div className="grid w-full max-w-[1146px] grid-cols-3 gap-[20px] max-md:grid-cols-1 max-md:gap-[16px]">
        <GlassCard title="email" className="h-full" data-contact-item>
          <a
            href={`mailto:${EMAIL}`}
            className="break-words text-white transition-opacity hover:opacity-70"
          >
            {EMAIL}
          </a>
        </GlassCard>

        <GlassCard title="phone" className="h-full" data-contact-item>
          <a
            href={`tel:${PHONE_E164}`}
            className="whitespace-nowrap text-white transition-opacity hover:opacity-70"
          >
            {PHONE_DISPLAY}
          </a>
        </GlassCard>

        <GlassCard title="office" className="h-full" data-contact-item>
          <address className="not-italic">
            <span className="block tracking-[0.08em] text-white/70">
              KIWIKORU LIMITED
            </span>
            <span className="mt-[6px] block">{ADDRESS}</span>
          </address>
        </GlassCard>
      </div>
    </section>
  );
}
