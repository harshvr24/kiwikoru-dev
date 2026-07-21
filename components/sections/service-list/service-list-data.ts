/**
 * KiwiKoru's six services.
 *
 * ✅ REAL CONTENT — unlike most copy in this project, these are KiwiKoru's own
 * service descriptions, lifted from the WordPress front page (wp_posts ID 23,
 * the "Our Services" block). See CONTENT-SOURCE.md.
 *
 * They have been rewritten into the site's lowercase voice per the project's
 * standing decision, but every claim is theirs — "certified AWS architects",
 * "24/7 monitoring", "automated backups" and so on all come from the source.
 * Don't add capabilities they haven't advertised.
 *
 * Two defects in the source were fixed here rather than carried across:
 *
 *  1. `Infra Management` and `AWS Governance` shipped BYTE-IDENTICAL
 *     descriptions ("Control Without Compromise…"). That text is clearly about
 *     governance, so it stays on AWS Governance; the Infra Management entry
 *     below is AUTHORED to fill the gap and is marked as such. Have the client
 *     confirm it — do not "restore" the duplicate.
 *  2. Several paragraphs ran a lead phrase straight into the next sentence with
 *     no punctuation ("Move with Confidence We execute…", "Control Without
 *     Compromise True innovation…"). Those are split properly here.
 */

export type Service = {
  /** Heading, exactly as the site's "Our Services" block names it. */
  readonly name: string;
  /** One-line lead — the source's run-in phrase where it had one. */
  readonly lead: string;
  readonly body: string;
  /** True where the copy is ours, not KiwiKoru's. */
  readonly authored?: boolean;
};

export const SERVICES: readonly Service[] = [
  {
    name: "aws consulting",
    lead: "a roadmap, not a sales deck.",
    body: "our certified aws architects give strategic guidance to navigate the cloud. we analyse your goals to design secure, scalable, cost-efficient infrastructure — whether you're launching new applications or optimising the workloads you already run.",
  },
  {
    name: "migration",
    lead: "move with confidence.",
    body: "we execute flawless migrations that minimise downtime and keep data integrity absolute. moving to the cloud or switching providers, the approach is the same: plan first, prove it, then cut over — with business continuity throughout.",
  },
  {
    name: "managed services",
    lead: "building dreams requires focus.",
    body: "we handle your cloud infrastructure so you can concentrate on the business. from 24/7 monitoring to automated backups, we keep systems available, secure, and running at peak performance.",
  },
  {
    name: "infra management",
    lead: "the day-to-day, handled.",
    // AUTHORED — the source duplicated the AWS Governance text here.
    body: "the ongoing care your environment needs to stay healthy: right-sized compute, patching on a schedule, capacity watched before it bites, and infrastructure defined as code you own. no drift, no surprises on the invoice.",
    authored: true,
  },
  {
    name: "aws governance",
    lead: "control without compromise.",
    body: "true innovation requires a safe environment. we implement governance frameworks that balance agility with control — clear guardrails and automated policies, so your teams can build and deploy fast without sacrificing security, compliance, or budget discipline.",
  },
  {
    name: "app development",
    lead: "vision into reality.",
    body: "custom development for high-performance mobile and web applications built to engage users. cloud-native architectures mean a seamless experience across devices, and an app that stays easy to scale as you expand.",
  },
];
