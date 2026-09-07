import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { contentService } from "@/services/contentService";

export async function generateMetadata(): Promise<Metadata> {
  const content = await contentService.getContent();
  return {
    title: "Обо мне",
    description: `${content.about.lead} ${content.site.name} — ${content.site.credentials}.`,
  };
}

export default async function AboutPage() {
  const { about, site } = await contentService.getContent();
  const portraitSrc =
    site.aboutPortraitSrc || site.portraitSrc || "/images/portrait-placeholder.svg";
  const remote = /^https?:\/\//i.test(portraitSrc);

  return (
    <div className="bg-paper">
      <div className="shell py-14 md:py-20">
        <p className="eyebrow">{site.credentials}</p>
        <h1 className="display mt-3 max-w-3xl text-[clamp(2.2rem,4.5vw,3.4rem)] text-ink">
          {about.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{about.lead}</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="portrait-slot relative aspect-[4/5] w-full max-w-md overflow-hidden lg:max-w-none">
            <Image
              src={portraitSrc}
              alt={site.portraitAlt}
              fill
              sizes="(max-width: 1024px) 90vw, 36vw"
              className="object-cover object-top"
              unoptimized={remote || portraitSrc.endsWith(".svg")}
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-5 text-base leading-relaxed text-ink-soft">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 28)}>{paragraph}</p>
              ))}
            </div>

            <aside className="card h-fit p-6">
              <dl className="space-y-5">
                {about.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs tracking-[0.12em] text-ink-soft uppercase">{fact.label}</dt>
                    <dd className="mt-1.5 text-base text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <Button href="/booking#form" className="mt-8 w-full">
                {"Записаться на\u00A015\u00A0минут"}
              </Button>
              <a
                href={site.telegram}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-center text-sm text-clay-deep no-underline hover:underline"
              >
                {"Или в\u00A0Telegram"}
              </a>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
