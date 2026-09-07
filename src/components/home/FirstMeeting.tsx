import type { FirstMeetingContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FirstMeeting({ content }: { content: FirstMeetingContent }) {
  return (
    <section id="first-meeting" className="section-pad border-t border-line bg-sand/35" aria-labelledby="meeting-title">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Старт</p>
          <h2
            id="meeting-title"
            className="display mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] leading-tight text-ink"
          >
            {content.title}
          </h2>
          {content.lead ? (
            <p className="mt-3 text-base leading-relaxed text-ink-soft">{content.lead}</p>
          ) : null}
        </Reveal>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.steps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 70}>
              <article className="card h-full p-5">
                <span className="text-xs tracking-[0.14em] text-clay-deep uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </article>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={160} className="mt-10 max-w-xl">
          <Button href={content.cta.href}>{content.cta.label}</Button>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{content.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
