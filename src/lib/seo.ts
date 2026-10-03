import type { Metadata } from "next";
import type { SiteContent } from "@/content/types";
import { absoluteUrl, getSiteUrl } from "@/lib/siteUrl";

function truncate(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

export function buildRootMetadata(content: SiteContent): Metadata {
  const titleDefault = `${content.site.name} — ${content.site.title}`;
  const description = truncate(content.seo.description || content.hero.support, 160);
  const ogDescription = truncate(content.seo.ogDescription || content.site.tagline, 200);
  const siteUrl = getSiteUrl();
  const verification: Metadata["verification"] = {};
  const yandex = process.env.YANDEX_VERIFICATION?.trim();
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  if (yandex) verification.yandex = yandex;
  if (google) verification.google = google;

  return {
    metadataBase: new URL(`${siteUrl}/`),
    title: {
      default: titleDefault,
      template: `%s — ${content.site.name}`,
    },
    description,
    applicationName: content.site.name,
    authors: [{ name: content.site.name, url: siteUrl }],
    creator: content.site.name,
    publisher: content.site.name,
    keywords: content.seo.keywords,
    category: content.seo.category,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: titleDefault,
      description: ogDescription,
      url: siteUrl,
      siteName: content.site.name,
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description,
    },
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
    verification: Object.keys(verification).length > 0 ? verification : undefined,
  };
}

export function buildJsonLd(content: SiteContent): Record<string, unknown>[] {
  const siteUrl = getSiteUrl();
  const image = absoluteUrl(content.site.portraitSrc || "/images/portrait-bw.jpg");
  const sameAs = [content.site.telegram, content.site.whatsapp].filter(Boolean);

  const person: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.site.name,
    jobTitle: "Психолог",
    description: content.site.tagline,
    url: siteUrl,
    image,
    knowsAbout: content.seo.keywords.slice(0, 12),
  };
  if (content.site.phone) person.telephone = content.site.phone;
  if (content.site.email) person.email = content.site.email;
  if (content.site.city) {
    person.address = {
      "@type": "PostalAddress",
      addressLocality: content.site.city,
      addressCountry: "RU",
    };
  }
  if (sameAs.length > 0) person.sameAs = sameAs;

  const service: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${content.site.name} — психолог`,
    description: content.seo.description || content.site.tagline,
    url: siteUrl,
    image,
    areaServed: content.site.city ? [content.site.city, "Онлайн"] : ["Онлайн"],
    serviceType: "Психологическое консультирование",
    provider: {
      "@type": "Person",
      name: content.site.name,
    },
  };
  if (content.site.phone) service.telephone = content.site.phone;

  const website: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: content.site.name,
    url: siteUrl,
    inLanguage: "ru-RU",
    description: content.seo.description,
  };

  return [person, service, website];
}
