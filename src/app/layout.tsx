import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { buildRootMetadata } from "@/lib/seo";
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

export const viewport: Viewport = {
  themeColor: "#5a7168",
  colorScheme: "light",
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await contentService.getContent();
  return buildRootMetadata(content);
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
