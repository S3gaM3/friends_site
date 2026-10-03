import type { MetadataRoute } from "next";
import { contentService } from "@/services/contentService";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const content = await contentService.getContent();
  return {
    name: `${content.site.name} — психолог`,
    short_name: content.site.firstName,
    description: content.site.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5f0",
    theme_color: "#5a7168",
    lang: "ru",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
