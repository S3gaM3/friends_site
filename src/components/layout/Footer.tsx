import Link from "next/link";
import type { FooterContent, SiteProfile } from "@/content/types";

export function Footer({ site, footer }: { site: SiteProfile; footer: FooterContent }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-sand">
      <div className="shell grid gap-8 py-12 md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="display text-2xl text-ink">{site.name}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            {site.tagline}
            <span className="mx-1.5 text-line" aria-hidden>
              ·
            </span>
            {site.city}
          </p>
          <p className="mt-5 max-w-lg text-xs leading-relaxed text-ink-soft">{footer.note}</p>
          <p className="mt-2 max-w-lg text-xs leading-relaxed text-ink-soft">{footer.crisis}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-ink-soft md:items-end md:text-right">
          <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="hover:text-clay-deep">
            {site.phone}
          </a>
          <a href={site.telegram} className="hover:text-clay-deep" target="_blank" rel="noreferrer">
            Telegram · @d_shandalov
          </a>
          <Link href="/booking#form" className="mt-3 text-clay-deep no-underline hover:underline">
            {"Записаться на\u00A015\u00A0минут"}
          </Link>
        </div>
      </div>
      <div className="border-t border-line/70 px-5 py-4 text-center text-xs text-ink-soft">
        © {year} {site.name}
      </div>
    </footer>
  );
}
