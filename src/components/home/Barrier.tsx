import Image from "next/image";
import type { BarrierContent, SiteProfile } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function Barrier({ content, site }: { content: BarrierContent; site: SiteProfile }) {
  const portraitSrc =
    site.aboutPortraitSrc || site.portraitSrc || "/images/portrait-placeholder.svg";
  const remote = /^https?:\/\//i.test(portraitSrc);

  return (
    <section id="about-block" className="section-pad bg-paper" aria-labelledby="barrier-title">
      <div className="shell grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal>
          <div className="portrait-slot relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden lg:max-w-none">
            <Image
              src={portraitSrc}
              alt={site.portraitAlt}
              fill
              sizes="(max-width: 1024px) 80vw, 36vw"
              className="object-cover object-top"
              unoptimized={remote || portraitSrc.endsWith(".svg")}
            />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className="eyebrow">О специалисте</p>
          <h2
            id="barrier-title"
            className="display mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] leading-tight text-ink"
          >
            {content.title}
          </h2>
          <div className="mt-6 space-y-4">
            {content.paragraphs.map((p) => (
              <p key={p.slice(0, 28)} className="text-base leading-relaxed text-ink-soft md:text-lg">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
