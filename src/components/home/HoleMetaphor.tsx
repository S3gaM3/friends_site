import type { HoleContent } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function HoleMetaphor({ content }: { content: HoleContent }) {
  return (
    <section className="section-pad bg-paper" aria-labelledby="hole-title">
      <div className="shell grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <Reveal>
          <div className="mx-auto flex max-w-xs flex-col items-center text-center" aria-hidden>
            <p className="text-sm text-ink-soft">Человек</p>
            <p className="flow-arrow py-2">↓</p>
            <div className="relative w-full rounded-[var(--radius-lg)] border-2 border-dashed border-clay/50 bg-sand/50 px-6 py-14">
              <span className="mx-auto block h-3.5 w-3.5 rounded-full bg-clay-deep" />
              <p className="mt-6 text-xs tracking-[0.16em] text-clay-deep uppercase">Яма</p>
            </div>
            <p className="mt-4 text-sm text-ink-soft">сначала — как выбраться</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className="eyebrow">Философия</p>
          <h2
            id="hole-title"
            className="display mt-3 text-[clamp(1.7rem,3.2vw,2.4rem)] leading-tight text-ink"
          >
            {content.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-soft md:text-lg">{content.text}</p>
        </Reveal>
      </div>
    </section>
  );
}
