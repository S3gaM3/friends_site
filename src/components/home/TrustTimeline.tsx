import type { TrustTimelineContent } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function TrustTimeline({ content }: { content: TrustTimelineContent }) {
  return (
    <section id="about-block" className="section-pad border-t border-line bg-sand/40" aria-labelledby="trust-title">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Доверие</p>
          <h2
            id="trust-title"
            className="display mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] leading-tight text-ink"
          >
            {content.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{content.lead}</p>
        </Reveal>

        <ol className="mt-10 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-x-3 md:gap-y-3">
          {content.steps.map((step, index) => (
            <Reveal as="li" key={step} delay={index * 50} className="flex items-center gap-3">
              <span className="rounded-full border border-line bg-paper px-3.5 py-2 text-sm font-medium text-ink">
                {step}
              </span>
              {index < content.steps.length - 1 ? (
                <span className="text-clay" aria-hidden>
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              ) : null}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
