import type { RecognizeSelfContent } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function RecognizeSelf({ content }: { content: RecognizeSelfContent }) {
  return (
    <section id="recognize" className="section-pad border-t border-line bg-sand/40" aria-labelledby="recognize-title">
      <div className="shell max-w-3xl">
        <Reveal>
          <p className="eyebrow">Узнавание</p>
          <h2
            id="recognize-title"
            className="display mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] leading-tight text-ink"
          >
            {content.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{content.lead}</p>
        </Reveal>

        <ul className="mt-10 space-y-0">
          {content.items.map((item, index) => (
            <Reveal as="li" key={item.slice(0, 24)} delay={index * 60}>
              <div className="border-b border-line py-5">
                <p className="text-base leading-relaxed text-ink md:text-lg">{item}</p>
              </div>
              {index < content.items.length - 1 ? (
                <p className="flow-arrow py-2 text-center" aria-hidden>
                  ↓
                </p>
              ) : null}
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <p className="mt-10 text-base leading-relaxed text-ink-soft">{content.footer}</p>
        </Reveal>
      </div>
    </section>
  );
}
