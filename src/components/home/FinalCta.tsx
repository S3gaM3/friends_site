import type { FinalCtaContent, SiteProfile } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta({
  finalCta,
  site,
}: {
  finalCta: FinalCtaContent;
  site: SiteProfile;
}) {
  return (
    <section className="border-t border-line bg-sand">
      <div className="shell section-pad">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="display text-[clamp(1.8rem,3.4vw,2.7rem)] text-ink">{finalCta.title}</h2>
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-ink-soft md:text-lg">{finalCta.lead}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={finalCta.primaryCta.href}>{finalCta.primaryCta.label}</Button>
            <Button href={site.telegram} variant="ghost">
              {finalCta.secondaryCtaLabel}
            </Button>
          </div>
          <p className="mt-5 text-sm text-ink-soft">
            <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="hover:text-clay-deep">
              {site.phone}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
