import type { ServicesContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function ServicesPreview({ services }: { services: ServicesContent }) {
  return (
    <section id="services" className="section-pad bg-paper" aria-labelledby="services-title">
      <div className="shell">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Стоимость</p>
            <h2
              id="services-title"
              className="display mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] text-ink"
            >
              {services.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">{services.lead}</p>
          </div>
          <Button href="/booking#form" className="self-start">
            {"Записаться на\u00A0бесплатные 15\u00A0минут"}
          </Button>
        </Reveal>

        <div className="mt-10 overflow-hidden rounded-[var(--radius-xl)] bg-sand">
          <ul className="divide-y divide-line">
            {services.items.map((item, index) => (
              <Reveal as="li" key={item.id} delay={index * 80} variant="fade">
                <article className="grid gap-3 px-5 py-6 md:grid-cols-[1.4fr_auto] md:items-center md:gap-8 md:px-8 md:py-7">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">
                      {item.duration}
                      <span className="mx-2 text-line" aria-hidden>
                        ·
                      </span>
                      {item.format}
                    </p>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                      {item.description}
                    </p>
                  </div>
                  <p className="display text-2xl text-clay-deep md:text-right">{item.price}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
