import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildJsonLd } from "@/lib/seo";
import { contentService } from "@/services/contentService";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const content = await contentService.getContent();
  const nav = content.nav.filter((item) => {
    const isRecommendations =
      item.href === "/#recommendations" || item.href === "/recommendations";
    return !isRecommendations || content.recommendations.items.length > 0;
  });

  return (
    <>
      <JsonLd data={buildJsonLd(content)} />
      <Header site={content.site} nav={nav} />
      <main className="flex-1">{children}</main>
      <Footer site={content.site} footer={content.footer} />
    </>
  );
}
