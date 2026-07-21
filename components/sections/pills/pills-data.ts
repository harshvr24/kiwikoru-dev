// Capability pills for the "everything that gets you up there" section —
// Figma frame "SectionPills" (node 371:8260), pills group 371:8378.
//
// Plain data, no JSX: kept separate so the section component (and the
// pills-flow driver) can map over it without duplicating the list.
//
// `left`/`top` are the pill's absolute position IN PIXELS within the 1258×876
// "Pills" box (which itself sits at 13,17 inside the 1319×977 "capabilities"
// frame). We render at design scale (fixed px, center-anchored) exactly like
// the hero and cards sections, so these map 1:1 to the mockup.
//
// `mobileLeft`/`mobileTop` are the field re-fitted for phones (switched in below
// md via CSS vars in pills.tsx). The design scatter is ~3× the phone's width, so
// most pills fall off-screen and it reads empty. Rather than re-grid them into a
// list, this KEEPS the designer's scattered cloud and just compresses each x ~50%
// toward the field centre (629px) — same irregular vertical gaps, same varied x,
// so it still reads as a cloud, just narrower (edges dissolve via the mask). A
// few `mobileTop`s are then nudged off their design row (brand Identity, webflow,
// user-experience, email) so that where compression pushed two pills together
// horizontally they no longer share a row — so no two overlap.
//
// `lower` mirrors the Figma `lowercase` text-transform on the nodes that carry
// it (e.g. "Brand Guidelines" → "brand guidelines"); labels without it keep
// their authored casing ("website Design", "brand Identity").

export type PillSpec = {
  /** Figma node id, for cross-referencing the design. */
  id: string;
  label: string;
  /** px from the left of the 1258×876 Pills box (design scale, ≥ md). */
  left: number;
  /** px from the top of the 1258×876 Pills box (design scale, ≥ md). */
  top: number;
  /** px left in the compact mobile cloud (< md) — design x compressed ~50%. */
  mobileLeft: number;
  /** px top in the compact mobile cloud (< md) — design top, a few nudged. */
  mobileTop: number;
  /** Apply `text-transform: lowercase` (matches the Figma node). */
  lower?: boolean;
};

// KiwiKoru's six advertised services (aws consulting, infra management, managed
// services, app development, migration, aws governance) expanded to the 20 slots
// the design scatters.
//
// ⚠️ Every `left`/`top`/`mobileLeft`/`mobileTop` below is UNCHANGED from the
// Figma scatter — the field was hand-fitted so no two pills collide at either
// breakpoint. Only `label` (and `lower`) were rebranded. A longer label grows its
// pill to the RIGHT of its `left`, so if you lengthen one, re-check its row for
// overlap rather than nudging coordinates.
export const PILLS: PillSpec[] = [
  { id: "371:8385", label: "cost optimisation", left: 265, top: 0, mobileLeft: 447, mobileTop: 0 },
  { id: "371:8383", label: "well-architected reviews", left: 879, top: 56, mobileLeft: 754, mobileTop: 56 },
  { id: "371:8417", label: "aws Governance", left: 644, top: 88, mobileLeft: 637, mobileTop: 130 },
  { id: "371:8395", label: "Disaster Recovery", left: 8, top: 137, mobileLeft: 319, mobileTop: 137, lower: true },
  { id: "371:8379", label: "ec2", left: 433, top: 178, mobileLeft: 531, mobileTop: 196 },
  { id: "371:8409", label: "s3", left: 695, top: 198, mobileLeft: 662, mobileTop: 198 },
  { id: "371:8407", label: "infra Management", left: 962, top: 265, mobileLeft: 796, mobileTop: 265 },
  { id: "371:8381", label: "cloud migration", left: 23, top: 322, mobileLeft: 326, mobileTop: 322 },
  { id: "371:8415", label: "Maintenance and Support", left: 997, top: 387, mobileLeft: 813, mobileTop: 387, lower: true },
  { id: "371:8387", label: "app development", left: 170, top: 461, mobileLeft: 400, mobileTop: 461 },
  { id: "371:8397", label: "Security Hardening", left: 1035, top: 529, mobileLeft: 832, mobileTop: 529, lower: true },
  { id: "371:8389", label: "Landing Zones", left: 0, top: 557, mobileLeft: 315, mobileTop: 557, lower: true },
  { id: "371:8403", label: "kubernetes and ecs", left: 367, top: 613, mobileLeft: 498, mobileTop: 613 },
  { id: "371:8401", label: "ci/cd pipelines", left: 740, top: 613, mobileLeft: 685, mobileTop: 660 },
  { id: "371:8411", label: "rds and aurora", left: 101, top: 682, mobileLeft: 365, mobileTop: 682 },
  { id: "371:8405", label: "terraform and iac", left: 1084, top: 703, mobileLeft: 857, mobileTop: 703 },
  { id: "371:8399", label: "Monitoring and Alerting", left: 318, top: 731, mobileLeft: 474, mobileTop: 731, lower: true },
  { id: "371:8391", label: "Backup and Retention", left: 670, top: 795, mobileLeft: 650, mobileTop: 795, lower: true },
  { id: "371:8413", label: "vpc", left: 1000, top: 806, mobileLeft: 815, mobileTop: 850 },
  { id: "371:8393", label: "serverless", left: 277, top: 834, mobileLeft: 453, mobileTop: 834, lower: true },
];
