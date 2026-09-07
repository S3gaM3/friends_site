import Image from "next/image";
import type { HeroContent, SiteProfile } from "@/content/types";
import { Button } from "@/components/ui/Button";

export function Hero({ site, hero }: { site: SiteProfile; hero: HeroContent }) {
  const portraitSrc = site.portraitSrc || "/images/portrait-placeholder.svg";
  const remote = /^https?:\/\//i.test(portraitSrc);

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="shell grid gap-10 pb-12 pt-10 md:min-h-[calc(100svh-4.5rem)] md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14 md:pb-16 md:pt-14">
        <div className="order-2 md:order-1">
          <p className="reveal text-sm text-ink-soft">
            <span aria-hidden>📍 </span>
            {site.city}
            <span className="mx-2 text-line" aria-hidden>
              ·
            </span>
            {site.credentials}
          </p>

          <p className="reveal reveal-delay-1 mt-5 display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-ink">
            {site.name}
          </p>
          <p className="reveal reveal-delay-1 mt-1 text-sm tracking-[0.06em] text-clay-deep">
            {site.title}
          </p>

          <h1 className="reveal reveal-delay-2 display mt-7 max-w-[18ch] text-[clamp(1.9rem,4.2vw,3.1rem)] leading-[1.15] text-ink">
            {hero.headline}
          </h1>

          <p className="reveal reveal-delay-3 mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
            {hero.support}
          </p>

          <div className="reveal reveal-delay-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} variant="link" className="sm:ml-2">
              {hero.secondaryCta.label}
              <span aria-hidden> →</span>
            </Button>
          </div>

          <p className="reveal reveal-delay-4 mt-5 text-sm text-ink-soft">{hero.metaLine}</p>
        </div>

        <div className="reveal reveal-delay-2 order-1 md:order-2">
          <div className="relative mx-auto max-w-md md:max-w-none">
            <div className="portrait-glow soft-breathe" aria-hidden />
            <div className="portrait-slot relative z-[1] aspect-[4/5] soft-float">
              <Image
                src={portraitSrc}
                alt={site.portraitAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover object-[center_20%]"
                unoptimized={remote || portraitSrc.endsWith(".svg")}
              />
              <ul className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[13.5rem]">
                {hero.trustChips.map((chip) => (
                  <li key={chip.label} className="frosted px-3.5 py-2.5 text-sm text-ink">
                    {chip.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
