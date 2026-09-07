import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { contentService } from "@/services/contentService";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const content = await contentService.getContent();

  return (
    <>
      <Header site={content.site} nav={content.nav} />
      <main className="flex-1">{children}</main>
      <Footer site={content.site} footer={content.footer} />
    </>
  );
}
