"use client";

import { useState } from "react";
import type { StartChooserContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function StartChooser({ content }: { content: StartChooserContent }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="section-pad bg-paper" aria-labelledby="chooser-title">
      <div className="shell max-w-3xl">
        <Reveal>
          <p className="eyebrow">Старт</p>
          <h2
            id="chooser-title"
            className="display mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] leading-tight text-ink"
          >
            {content.title}
          </h2>
        </Reveal>

        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {content.options.map((option, index) => {
            const active = selected === option.id;
            return (
              <Reveal as="li" key={option.id} delay={index * 60}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(option.id)}
                  className={[
                    "card h-full w-full p-5 text-left text-sm font-medium leading-snug transition-[border-color,background-color,transform] duration-300",
                    active
                      ? "border-clay bg-[color-mix(in_srgb,white_88%,var(--sand))] text-ink"
                      : "text-ink-soft hover:-translate-y-0.5 hover:border-clay/40",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              </Reveal>
            );
          })}
        </ul>

        <div
          className={`mt-6 transition-opacity duration-300 ${selected ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-live="polite"
        >
          {selected ? (
            <div className="rounded-[var(--radius-lg)] border border-line bg-sand/50 px-5 py-5">
              <p className="text-base font-medium text-ink">{content.reply}</p>
              <Button href={content.cta.href} className="mt-4">
                {content.cta.label}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
