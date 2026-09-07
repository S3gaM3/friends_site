import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { contentService } from "@/services/contentService";

export async function generateMetadata(): Promise<Metadata> {
  const content = await contentService.getContent();
  return {
    title: content.services.title,
    description: content.services.lead,
  };
}

export default async function ServicesPage() {
  const { services } = await contentService.getContent();

  return (
    <div className="bg-sand/40">
      <div className="shell py-14 md:py-20">
        <p className="eyebrow">Прайс</p>
        <h1 className="display mt-3 max-w-3xl text-[clamp(2.2rem,4.5vw,3.4rem)] text-ink">
          {services.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{services.lead}</p>

        <div className="mt-12 overflow-hidden rounded-[var(--radius-xl)] bg-paper shadow-[var(--shadow-card)]">
          <ul className="divide-y divide-line">
            {services.items.map((item) => (
              <li key={item.id} id={item.id}>
                <article className="grid gap-4 px-5 py-8 md:grid-cols-[1.4fr_0.8fr] md:gap-10 md:px-8">
                  <div>
                    <h2 className="display text-2xl text-ink md:text-3xl">{item.title}</h2>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between gap-5">
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between gap-4 border-b border-line pb-2">
                        <dt className="text-ink-soft">Длительность</dt>
                        <dd className="text-ink">{item.duration}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-line pb-2">
                        <dt className="text-ink-soft">Формат</dt>
                        <dd className="text-ink">{item.format}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-ink-soft">Стоимость</dt>
                        <dd className="display text-xl text-clay-deep">{item.price}</dd>
                      </div>
                    </dl>
                    <Button href="/booking#form" variant="ghost" className="self-start">
                      {"Записаться на\u00A015\u00A0минут"}
                    </Button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
