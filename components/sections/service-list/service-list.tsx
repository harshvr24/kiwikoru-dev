import GlassCard from "@/components/ui/glass-card";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { SERVICES } from "./service-list-data";

/**
 * The six services, as a glass-card grid — the substance of `/services`.
 *
 * Transparent over the shared fixed sky like every other section (the global
 * <Background/> shows through; no local fill or grain). Flow-sized rather than
 * design-scale absolute: this block has no Figma node behind it — it was built
 * to carry KiwiKoru's real service copy, which the ascnd design had no slot for.
 *
 * 3-up on desktop → 2-up at md → 1-up on phones. Cards stretch to equal height
 * per row, so ragged copy lengths don't produce a stepped grid.
 */
export default function ServiceList() {
  return (
    <section
      data-service-list
      className="relative flex w-full justify-center overflow-hidden px-6 pb-[12dvh]"
    >
      <RevealOnScroll selector="[data-service-card]" />
      <div className="grid w-full max-w-[1146px] grid-cols-3 gap-[20px] max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-[16px]">
        {SERVICES.map((s) => (
          <GlassCard
            key={s.name}
            title={s.name}
            className="h-full"
            data-service-card
          >
            <span className="block text-white">{s.lead}</span>
            <span className="mt-[6px] block">{s.body}</span>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
