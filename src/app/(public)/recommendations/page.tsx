import type { Metadata } from "next";
import { Recommendations } from "@/components/home/Recommendations";
import { Button } from "@/components/ui/Button";
import { contentService } from "@/services/contentService";
import { absoluteUrl } from "@/lib/siteUrl";

export async function generateMetadata(): Promise<Metadata> {
  const content = await contentService.getContent();
  const description =
    content.recommendations.lead ||
    `Специалисты, которых рекомендует ${content.site.name}.`;
  return {
    title: content.recommendations.title,
    description,
    alternates: { canonical: "/recommendations" },
    openGraph: {
      title: `${content.recommendations.title} — ${content.site.name}`,
      description,
      url: absoluteUrl("/recommendations"),
    },
  };
}

export default async function RecommendationsPage() {
  const content = await contentService.getContent();
  const { recommendations } = content;

  if (!recommendations.items.length) {
    return (
      <div className="bg-paper">
        <div className="shell py-14 md:py-20">
          <p className="eyebrow">Рекомендации</p>
          <h1 className="display mt-3 max-w-3xl text-[clamp(2.2rem,4.5vw,3.4rem)] text-ink">
            {recommendations.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {recommendations.lead ||
              "Список специалистов появится здесь. Пока можно записаться ко\u00A0мне или написать в\u00A0Telegram."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/booking#form">{"Записаться на\u00A0знакомство"}</Button>
            <Button href={content.site.telegram} variant="ghost">
              {"Написать в\u00A0Telegram"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="shell pt-14 md:pt-20">
        <p className="eyebrow">Рекомендации</p>
        <h1 className="display mt-3 max-w-3xl text-[clamp(2.2rem,4.5vw,3.4rem)] text-ink">
          {recommendations.title}
        </h1>
        {recommendations.lead ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {recommendations.lead}
          </p>
        ) : null}
      </div>
      <Recommendations content={recommendations} showIntro={false} />
    </div>
  );
}
