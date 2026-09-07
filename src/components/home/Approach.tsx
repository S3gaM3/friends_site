import type { ApproachContent } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function Approach({ content }: { content: ApproachContent }) {
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
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">{content.lead}</p>
          </Reveal>

          <div className="mt-6 max-w-xl space-y-4">
            {content.paragraphs.map((p, i) => (
              <Reveal key={p.slice(0, 20)} delay={80 + i * 60}>
                <p className="text-base leading-relaxed text-ink-soft">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <p className="mt-8 text-sm font-medium text-ink">{content.methodsTitle}</p>
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
          </Reveal>
        </div>

        <Reveal delay={100}>
          <ol className="card space-y-0 p-6 md:p-7">
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
                  <p className="flow-arrow py-2" aria-hidden>
                    ↓
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
