import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { contentService } from "@/services/contentService";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await contentService.getContent();
  return {
    title: {
      default: `${content.site.name} — ${content.site.title}`,
      template: `%s — ${content.site.name}`,
    },
    description: content.hero.support,
    openGraph: {
      title: `${content.site.name} — ${content.site.title}`,
      description: content.hero.headline,
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
