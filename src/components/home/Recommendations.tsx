import Image from "next/image";
import type { RecommendationsContent } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function Recommendations({
  content,
  showIntro = true,
}: {
  content: RecommendationsContent;
  showIntro?: boolean;
}) {
  if (!content.items.length) return null;

  return (
    <section
      id="recommendations"
      className="section-pad bg-sand/50"
      aria-labelledby={showIntro ? "recommendations-title" : undefined}
    >
      <div className="shell">
        {showIntro ? (
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Рекомендации</p>
            <h2
              id="recommendations-title"
              className="display mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] text-ink"
            >
              {content.title}
            </h2>
            {content.lead ? (
              <p className="mt-3 text-base leading-relaxed text-ink-soft md:text-lg">
                {content.lead}
              </p>
            ) : null}
          </Reveal>
        ) : null}

        <ul
          className={`${showIntro ? "mt-10" : ""} divide-y divide-line border-y border-line`}
        >
          {content.items.map((item, index) => {
            const photo = item.photoSrc?.trim();
            const remote = photo ? /^https?:\/\//i.test(photo) : false;
            return (
              <Reveal as="li" key={item.id} delay={index * 70} variant="fade">
                <article className="grid gap-5 py-7 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:py-8">
                  {photo ? (
                    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-paper md:h-24 md:w-24">
                      <Image
                        src={photo}
                        alt={item.photoAlt || item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                        unoptimized={remote || photo.endsWith(".svg")}
                      />
                    </div>
                  ) : (
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-paper text-lg font-semibold text-clay-deep md:h-24 md:w-24"
                      aria-hidden
                    >
                      {item.name
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-ink md:text-xl">{item.name}</h3>
                    <p className="mt-1 text-sm text-clay-deep">{item.role}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-base">
                      {item.description}
                    </p>
                  </div>

                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center self-start rounded-[var(--radius)] border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink no-underline transition-colors hover:border-clay hover:text-clay-deep md:self-center"
                  >
                    {item.ctaLabel || "Связаться"}
                  </a>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
