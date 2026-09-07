import type { ApproachContent, HoleContent } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function Approach({
  content,
  hole,
}: {
  content: ApproachContent;
  hole: HoleContent;
}) {
  return (
    <section id="approach" className="section-pad border-t border-line bg-sand/35" aria-labelledby="approach-title">
      <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <Reveal>
            <p className="eyebrow">Подход</p>
            <h2
              id="approach-title"
              className="display mt-3 max-w-2xl text-[clamp(1.7rem,3.4vw,2.55rem)] leading-tight text-ink"
            >
              {content.title}
            </h2>
          </Reveal>

          <div className="mt-6 max-w-xl space-y-4">
            {content.paragraphs.map((p, i) => (
              <Reveal key={p.slice(0, 28)} delay={60 + i * 50}>
                <p className="text-base leading-relaxed text-ink-soft">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <p className="mt-8 text-sm font-semibold text-ink">{content.methodsTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{content.methodsLead}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {content.methods.map((method) => (
                <li
                  key={method}
                  className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-ink-soft"
                >
                  {method}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">{content.note}</p>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="card space-y-6 p-6 md:p-7">
            <div className="mx-auto flex max-w-[12rem] flex-col items-center text-center" aria-hidden>
              <p className="text-xs text-ink-soft">Человек</p>
              <p className="flow-arrow py-1.5">↓</p>
              <div className="w-full rounded-[var(--radius)] border-2 border-dashed border-clay/45 bg-sand/60 px-4 py-10">
                <span className="mx-auto block h-3 w-3 rounded-full bg-clay-deep" />
                <p className="mt-4 text-[0.65rem] tracking-[0.14em] text-clay-deep uppercase">Яма</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{hole.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{hole.text}</p>
            </div>
            <ol className="space-y-0 border-t border-line pt-5">
              {content.flow.map((step, index) => (
                <li key={step} className="text-center">
                  <p
                    className={`text-sm leading-snug ${
                      index === 0 || index === content.flow.length - 1
                        ? "font-semibold text-ink"
                        : "text-ink-soft"
                    }`}
                  >
                    {step}
                  </p>
                  {index < content.flow.length - 1 ? (
                    <p className="flow-arrow py-1.5" aria-hidden>
                      ↓
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
