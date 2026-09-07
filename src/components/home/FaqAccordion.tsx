"use client";

import { useState } from "react";
import type { FaqContent } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function FaqAccordion({ content }: { content: FaqContent }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad border-t border-line bg-sand/40" aria-labelledby="faq-title">
      <div className="shell max-w-3xl">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2
            id="faq-title"
            className="display mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] leading-tight text-ink"
          >
            {content.title}
          </h2>
        </Reveal>

        <ul className="mt-8 divide-y divide-line rounded-[var(--radius-xl)] border border-line bg-paper">
          {content.items.map((item, index) => {
            const isOpen = open === index;
            return (
              <li key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left md:px-6"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="text-base font-medium text-ink">{item.question}</span>
                  <span className="mt-1 text-clay-deep" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft md:px-6">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
