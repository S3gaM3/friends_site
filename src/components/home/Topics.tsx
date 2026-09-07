import type { TopicsContent } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function Topics({ content }: { content: TopicsContent }) {
  return (
    <section id="topics" className="section-pad bg-paper" aria-labelledby="topics-title">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Запросы</p>
          <h2
            id="topics-title"
            className="display mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] leading-tight text-ink"
          >
            {content.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">{content.lead}</p>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 45}>
              <article className="card card-lift h-full p-5 md:p-6">
                <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </ul>

        {content.footer ? (
          <Reveal delay={120}>
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink-soft">{content.footer}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
