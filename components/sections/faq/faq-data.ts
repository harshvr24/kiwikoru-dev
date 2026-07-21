/**
 * FAQ content (Figma node 526:414). The design only draws the six collapsed
 * question pills (526:415…526:450) — no answer copy exists in the mock, so the
 * answers are authored here in the site's established voice (lowercase, direct,
 * confident — mirroring pricing-data.ts and working-with.tsx).
 */

export type Faq = {
  /** Question label, exactly as the Figma pill reads (526:416, 526:423, …). */
  readonly question: string;
  /** Answer revealed on expand — authored copy, not from the mock. */
  readonly answer: string;
};

// PLACEHOLDER COPY — no FAQ content exists on the KiwiKoru site. These six are
// authored in the house voice to fill the design's six pills (the count is fixed
// by the mock). Answers make claims about SLAs, certifications and billing:
// verify each with the client before publishing.
export const FAQS: readonly Faq[] = [
  {
    question: "how long does a migration take?",
    answer:
      "most lift-and-shift moves land in two to six weeks depending on how much data follows you. you get a plan with dates and a rollback path before anything moves.",
  },
  {
    question: "will you actually cut our aws bill?",
    answer:
      "usually, and materially. right-sizing, reserved capacity and killing idle resources are the first pass — we review spend monthly and show you the delta, not just a dashboard.",
  },
  {
    question: "what happens when something breaks at 3am?",
    answer:
      "monitoring is 24/7 and so are we. alerts page a real engineer who knows your stack, and you get an incident write-up afterwards rather than a closed ticket.",
  },
  {
    question: "do we have to move everything at once?",
    answer:
      "no. most clients run hybrid for a while — we migrate in waves, keep both sides talking, and only cut over when the new environment has proven itself.",
  },
  {
    question: "who actually does the work?",
    answer:
      "aws certified engineers, the same ones each time. no offshore handoff, no rotating bench, no junior learning on your production account.",
  },
  {
    question: "are we locked in?",
    answer:
      "no. managed services run month to month, and everything we build is plain aws with terraform you own. if you leave, your infrastructure leaves with you.",
  },
];
