"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent, StoredBooking } from "@/content/types";
import { Button } from "@/components/ui/Button";

type TabId =
  | "site"
  | "hero"
  | "trust"
  | "recognition"
  | "shift"
  | "about"
  | "process"
  | "services"
  | "testimonials"
  | "bookingCard"
  | "finalCta"
  | "booking"
  | "footer"
  | "bookings";

const TABS: { id: TabId; label: string }[] = [
  { id: "site", label: "Профиль" },
  { id: "hero", label: "Первый экран" },
  { id: "trust", label: "Доверие" },
  { id: "recognition", label: "Узнавание" },
  { id: "shift", label: "Поворот" },
  { id: "about", label: "Обо\u00A0мне" },
  { id: "process", label: "Процесс" },
  { id: "services", label: "Форматы" },
  { id: "testimonials", label: "Отзывы" },
  { id: "bookingCard", label: "Блок записи" },
  { id: "finalCta", label: "Призыв" },
  { id: "booking", label: "Форма" },
  { id: "footer", label: "Подвал" },
  { id: "bookings", label: "Заявки" },
];
const fieldClass =
  "mt-1.5 w-full rounded-[var(--radius)] border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-clay";
const labelClass = "block text-sm font-medium text-ink";

function Field({
  label,
  value,
  onChange,
  multiline,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {multiline ? (
        <textarea
          className={`${fieldClass} resize-y`}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export function AdminDashboard({
  initialContent,
  initialBookings,
}: {
  initialContent: SiteContent;
  initialBookings: StoredBooking[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("site");
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [bookings, setBookings] = useState(initialBookings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const title = TABS.find((t) => t.id === tab)?.label ?? "";

  async function save() {
    setStatus("saving");
    setError(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await response.json()) as { ok: boolean; error?: string; content?: SiteContent };
      if (!response.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "Не удалось сохранить.");
        return;
      }
      if (data.content) setContent(data.content);
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
      setError("Сеть недоступна.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function refreshBookings() {
    const response = await fetch("/api/admin/bookings");
    const data = (await response.json()) as { ok: boolean; bookings?: StoredBooking[] };
    if (data.ok && data.bookings) setBookings(data.bookings);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm tracking-[0.14em] text-clay-deep uppercase">Контент</p>
          <h1 className="display mt-2 text-3xl text-ink">Управление сайтом</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {tab !== "bookings" ? (
            <Button onClick={save} disabled={status === "saving"}>
              {status === "saving" ? "Сохраняю…" : "Сохранить"}
            </Button>
          ) : (
            <Button variant="ghost" onClick={refreshBookings}>
              Обновить заявки
            </Button>
          )}
          <Button variant="ghost" onClick={logout}>
            Выйти
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {status === "saved" ? (
        <p className="mt-4 text-sm text-clay-deep" role="status">
          Сохранено. Обновите публичную страницу, если она уже открыта.
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Разделы управления">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setStatus("idle");
              }}
              className={`whitespace-nowrap rounded-[var(--radius)] px-3 py-2 text-left text-sm transition-colors ${
                tab === item.id
                  ? "bg-clay-deep text-paper"
                  : "bg-white text-ink-soft hover:bg-sand/80 hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <section className="rounded-[calc(var(--radius)+4px)] border border-line bg-white/80 p-5 md:p-7">
          <h2 className="display text-2xl text-ink">{title}</h2>
          <div className="mt-6 space-y-4">
            {tab === "site" ? (
              <>
                <Field
                  label="Имя"
                  value={content.site.name}
                  onChange={(v) => setContent({ ...content, site: { ...content.site, name: v } })}
                />
                <Field
                  label="Имя коротко"
                  value={content.site.firstName}
                  onChange={(v) => setContent({ ...content, site: { ...content.site, firstName: v } })}
                />
                <Field
                  label="Должность"
                  value={content.site.title}
                  onChange={(v) => setContent({ ...content, site: { ...content.site, title: v } })}
                />
                <Field
                  label="Слоган"
                  value={content.site.tagline}
                  onChange={(v) => setContent({ ...content, site: { ...content.site, tagline: v } })}
                />
                <Field
                  label="Город / формат"
                  value={content.site.city}
                  onChange={(v) => setContent({ ...content, site: { ...content.site, city: v } })}
                />
                <Field
                  label="Квалификация"
                  value={content.site.credentials}
                  onChange={(v) => setContent({ ...content, site: { ...content.site, credentials: v } })}
                />
                <Field
                  label="Email"
                  value={content.site.email}
                  onChange={(v) => setContent({ ...content, site: { ...content.site, email: v } })}
                />
                <Field
                  label="Телефон"
                  value={content.site.phone}
                  onChange={(v) => setContent({ ...content, site: { ...content.site, phone: v } })}
                />
                <Field
                  label="Ссылка Telegram"
                  value={content.site.telegram}
                  onChange={(v) => setContent({ ...content, site: { ...content.site, telegram: v } })}
                />
                <Field
                  label="Ссылка WhatsApp"
                  value={content.site.whatsapp}
                  onChange={(v) => setContent({ ...content, site: { ...content.site, whatsapp: v } })}
                />
                <Field
                  label="Портрет — путь или URL"
                  value={content.site.portraitSrc}
                  onChange={(v) =>
                    setContent({ ...content, site: { ...content.site, portraitSrc: v } })
                  }
                />
                <Field
                  label="Портрет — alt-текст"
                  value={content.site.portraitAlt}
                  onChange={(v) =>
                    setContent({ ...content, site: { ...content.site, portraitAlt: v } })
                  }
                />
              </>
            ) : null}

            {tab === "hero" ? (
              <>
                <Field
                  label="Заголовок"
                  value={content.hero.headline}
                  onChange={(v) => setContent({ ...content, hero: { ...content.hero, headline: v } })}
                  multiline
                  rows={3}
                />
                <Field
                  label="Подзаголовок"
                  value={content.hero.support}
                  onChange={(v) => setContent({ ...content, hero: { ...content.hero, support: v } })}
                  multiline
                />
                <Field
                  label="Мета-строка (цена / формат)"
                  value={content.hero.metaLine}
                  onChange={(v) =>
                    setContent({ ...content, hero: { ...content.hero, metaLine: v } })
                  }
                />
                <Field
                  label="Основная кнопка — текст"
                  value={content.hero.primaryCta.label}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, label: v } },
                    })
                  }
                />
                <Field
                  label="Основная кнопка — ссылка"
                  value={content.hero.primaryCta.href}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, href: v } },
                    })
                  }
                />
                <Field
                  label="Вторичная кнопка — текст"
                  value={content.hero.secondaryCta.label}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: {
                        ...content.hero,
                        secondaryCta: { ...content.hero.secondaryCta, label: v },
                      },
                    })
                  }
                />
                <Field
                  label="Вторичная кнопка — ссылка"
                  value={content.hero.secondaryCta.href}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: {
                        ...content.hero,
                        secondaryCta: { ...content.hero.secondaryCta, href: v },
                      },
                    })
                  }
                />
                {content.hero.trustChips.map((chip, index) => (
                  <Field
                    key={index}
                    label={`Чип на\u00A0фото ${index + 1}`}
                    value={chip.label}
                    onChange={(v) => {
                      const trustChips = [...content.hero.trustChips];
                      trustChips[index] = { label: v };
                      setContent({ ...content, hero: { ...content.hero, trustChips } });
                    }}
                  />
                ))}
              </>
            ) : null}

            {tab === "trust" ? (
              <>
                {content.trustStrip.items.map((item, index) => (
                  <div key={index} className="rounded-[var(--radius)] border border-line p-4">
                    <Field
                      label={`Пункт ${index + 1} — заголовок`}
                      value={item.title}
                      onChange={(v) => {
                        const items = [...content.trustStrip.items];
                        items[index] = { ...item, title: v };
                        setContent({ ...content, trustStrip: { items } });
                      }}
                    />
                    <div className="mt-3">
                      <Field
                        label="Текст"
                        value={item.text}
                        onChange={(v) => {
                          const items = [...content.trustStrip.items];
                          items[index] = { ...item, text: v };
                          setContent({ ...content, trustStrip: { items } });
                        }}
                        multiline
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            {tab === "recognition" ? (
              <>
                <Field
                  label="Заголовок"
                  value={content.recognition.title}
                  onChange={(v) =>
                    setContent({ ...content, recognition: { ...content.recognition, title: v } })
                  }
                />
                <Field
                  label="Лид"
                  value={content.recognition.lead}
                  onChange={(v) =>
                    setContent({ ...content, recognition: { ...content.recognition, lead: v } })
                  }
                  multiline
                />
                {content.recognition.scenes.map((scene, index) => (
                  <div key={index} className="rounded-[var(--radius)] border border-line p-4">
                    <p className="mb-3 text-xs tracking-wide text-ink-soft uppercase">
                      Сцена {index + 1}
                    </p>
                    <Field
                      label="Заголовок"
                      value={scene.title}
                      onChange={(v) => {
                        const scenes = [...content.recognition.scenes];
                        scenes[index] = { ...scene, title: v };
                        setContent({
                          ...content,
                          recognition: { ...content.recognition, scenes },
                        });
                      }}
                    />
                    <div className="mt-3">
                      <Field
                        label="Текст"
                        value={scene.text}
                        onChange={(v) => {
                          const scenes = [...content.recognition.scenes];
                          scenes[index] = { ...scene, text: v };
                          setContent({
                            ...content,
                            recognition: { ...content.recognition, scenes },
                          });
                        }}
                        multiline
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            {tab === "shift" ? (
              <>
                <Field
                  label="Заголовок"
                  value={content.shift.title}
                  onChange={(v) => setContent({ ...content, shift: { ...content.shift, title: v } })}
                />
                <Field
                  label="Лид"
                  value={content.shift.lead}
                  onChange={(v) => setContent({ ...content, shift: { ...content.shift, lead: v } })}
                  multiline
                />
                {content.shift.outcomes.map((item, index) => (
                  <div key={index} className="rounded-[var(--radius)] border border-line p-4">
                    <Field
                      label={`Результат ${index + 1} — заголовок`}
                      value={item.title}
                      onChange={(v) => {
                        const outcomes = [...content.shift.outcomes];
                        outcomes[index] = { ...item, title: v };
                        setContent({ ...content, shift: { ...content.shift, outcomes } });
                      }}
                    />
                    <div className="mt-3">
                      <Field
                        label="Текст"
                        value={item.text}
                        onChange={(v) => {
                          const outcomes = [...content.shift.outcomes];
                          outcomes[index] = { ...item, text: v };
                          setContent({ ...content, shift: { ...content.shift, outcomes } });
                        }}
                        multiline
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            {tab === "about" ? (
              <>
                <p className="text-sm font-medium text-clay-deep">Тизер на{"\u00A0"}главной</p>
                <Field
                  label="Заголовок тизера"
                  value={content.aboutTeaser.title}
                  onChange={(v) =>
                    setContent({ ...content, aboutTeaser: { ...content.aboutTeaser, title: v } })
                  }
                />
                <Field
                  label="Лид тизера"
                  value={content.aboutTeaser.lead}
                  onChange={(v) =>
                    setContent({ ...content, aboutTeaser: { ...content.aboutTeaser, lead: v } })
                  }
                  multiline
                />
                <Field
                  label="Текст тизера"
                  value={content.aboutTeaser.text}
                  onChange={(v) =>
                    setContent({ ...content, aboutTeaser: { ...content.aboutTeaser, text: v } })
                  }
                  multiline
                  rows={5}
                />
                <p className="pt-2 text-sm font-medium text-clay-deep">Страница «Обо{"\u00A0"}мне»</p>
                <Field
                  label="Заголовок"
                  value={content.about.title}
                  onChange={(v) => setContent({ ...content, about: { ...content.about, title: v } })}
                />
                <Field
                  label="Лид"
                  value={content.about.lead}
                  onChange={(v) => setContent({ ...content, about: { ...content.about, lead: v } })}
                  multiline
                />
                {content.about.paragraphs.map((paragraph, index) => (
                  <Field
                    key={index}
                    label={`Абзац ${index + 1}`}
                    value={paragraph}
                    onChange={(v) => {
                      const paragraphs = [...content.about.paragraphs];
                      paragraphs[index] = v;
                      setContent({ ...content, about: { ...content.about, paragraphs } });
                    }}
                    multiline
                    rows={5}
                  />
                ))}
                {content.about.facts.map((fact, index) => (
                  <div key={index} className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label={`Факт ${index + 1} — подпись`}
                      value={fact.label}
                      onChange={(v) => {
                        const facts = [...content.about.facts];
                        facts[index] = { ...fact, label: v };
                        setContent({ ...content, about: { ...content.about, facts } });
                      }}
                    />
                    <Field
                      label="Значение"
                      value={fact.value}
                      onChange={(v) => {
                        const facts = [...content.about.facts];
                        facts[index] = { ...fact, value: v };
                        setContent({ ...content, about: { ...content.about, facts } });
                      }}
                    />
                  </div>
                ))}
              </>
            ) : null}

            {tab === "process" ? (
              <>
                <Field
                  label="Заголовок"
                  value={content.process.title}
                  onChange={(v) =>
                    setContent({ ...content, process: { ...content.process, title: v } })
                  }
                />
                <Field
                  label="Лид"
                  value={content.process.lead}
                  onChange={(v) =>
                    setContent({ ...content, process: { ...content.process, lead: v } })
                  }
                  multiline
                />
                {content.process.steps.map((step, index) => (
                  <div key={index} className="rounded-[var(--radius)] border border-line p-4">
                    <Field
                      label={`Шаг ${index + 1}`}
                      value={step.title}
                      onChange={(v) => {
                        const steps = [...content.process.steps];
                        steps[index] = { ...step, title: v };
                        setContent({ ...content, process: { ...content.process, steps } });
                      }}
                    />
                    <div className="mt-3">
                      <Field
                        label="Текст"
                        value={step.text}
                        onChange={(v) => {
                          const steps = [...content.process.steps];
                          steps[index] = { ...step, text: v };
                          setContent({ ...content, process: { ...content.process, steps } });
                        }}
                        multiline
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            {tab === "services" ? (
              <>
                <Field
                  label="Заголовок"
                  value={content.services.title}
                  onChange={(v) =>
                    setContent({ ...content, services: { ...content.services, title: v } })
                  }
                />
                <Field
                  label="Лид"
                  value={content.services.lead}
                  onChange={(v) =>
                    setContent({ ...content, services: { ...content.services, lead: v } })
                  }
                  multiline
                />
                {content.services.items.map((item, index) => (
                  <div key={item.id} className="space-y-3 rounded-[var(--radius)] border border-line p-4">
                    <p className="text-xs tracking-wide text-ink-soft uppercase">Услуга {item.id}</p>
                    <Field
                      label="Название"
                      value={item.title}
                      onChange={(v) => {
                        const items = [...content.services.items];
                        items[index] = { ...item, title: v };
                        setContent({ ...content, services: { ...content.services, items } });
                      }}
                    />
                    <Field
                      label="Описание"
                      value={item.description}
                      onChange={(v) => {
                        const items = [...content.services.items];
                        items[index] = { ...item, description: v };
                        setContent({ ...content, services: { ...content.services, items } });
                      }}
                      multiline
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field
                        label="Длительность"
                        value={item.duration}
                        onChange={(v) => {
                          const items = [...content.services.items];
                          items[index] = { ...item, duration: v };
                          setContent({ ...content, services: { ...content.services, items } });
                        }}
                      />
                      <Field
                        label="Формат"
                        value={item.format}
                        onChange={(v) => {
                          const items = [...content.services.items];
                          items[index] = { ...item, format: v };
                          setContent({ ...content, services: { ...content.services, items } });
                        }}
                      />
                      <Field
                        label="Цена"
                        value={item.price}
                        onChange={(v) => {
                          const items = [...content.services.items];
                          items[index] = { ...item, price: v };
                          setContent({ ...content, services: { ...content.services, items } });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            {tab === "testimonials" ? (
              <>
                <Field
                  label="Заголовок"
                  value={content.testimonials.title}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      testimonials: { ...content.testimonials, title: v },
                    })
                  }
                />
                <Field
                  label="Лид"
                  value={content.testimonials.lead}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      testimonials: { ...content.testimonials, lead: v },
                    })
                  }
                  multiline
                />
                {content.testimonials.items.map((item, index) => (
                  <div key={index} className="space-y-3 rounded-[var(--radius)] border border-line p-4">
                    <Field
                      label={`Отзыв ${index + 1}`}
                      value={item.quote}
                      onChange={(v) => {
                        const items = [...content.testimonials.items];
                        items[index] = { ...item, quote: v };
                        setContent({
                          ...content,
                          testimonials: { ...content.testimonials, items },
                        });
                      }}
                      multiline
                      rows={4}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="Имя"
                        value={item.name}
                        onChange={(v) => {
                          const items = [...content.testimonials.items];
                          items[index] = { ...item, name: v };
                          setContent({
                            ...content,
                            testimonials: { ...content.testimonials, items },
                          });
                        }}
                      />
                      <Field
                        label="Мета (возраст и\u00A0т.\u00A0п.)"
                        value={item.meta}
                        onChange={(v) => {
                          const items = [...content.testimonials.items];
                          items[index] = { ...item, meta: v };
                          setContent({
                            ...content,
                            testimonials: { ...content.testimonials, items },
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            {tab === "bookingCard" ? (
              <>
                <Field
                  label="Заголовок"
                  value={content.bookingCard.title}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      bookingCard: { ...content.bookingCard, title: v },
                    })
                  }
                />
                <Field
                  label="Цена"
                  value={content.bookingCard.price}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      bookingCard: { ...content.bookingCard, price: v },
                    })
                  }
                />
                <Field
                  label="Длительность"
                  value={content.bookingCard.duration}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      bookingCard: { ...content.bookingCard, duration: v },
                    })
                  }
                />
                <Field
                  label="Формат / место"
                  value={content.bookingCard.places}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      bookingCard: { ...content.bookingCard, places: v },
                    })
                  }
                />
                <Field
                  label="Часы"
                  value={content.bookingCard.hours}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      bookingCard: { ...content.bookingCard, hours: v },
                    })
                  }
                />
                <Field
                  label="Примечание"
                  value={content.bookingCard.note}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      bookingCard: { ...content.bookingCard, note: v },
                    })
                  }
                  multiline
                />
                <Field
                  label="Кнопка — текст"
                  value={content.bookingCard.primaryCta.label}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      bookingCard: {
                        ...content.bookingCard,
                        primaryCta: { ...content.bookingCard.primaryCta, label: v },
                      },
                    })
                  }
                />
                <Field
                  label="Кнопка — ссылка"
                  value={content.bookingCard.primaryCta.href}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      bookingCard: {
                        ...content.bookingCard,
                        primaryCta: { ...content.bookingCard.primaryCta, href: v },
                      },
                    })
                  }
                />
                <Field
                  label="Вторичная ссылка — текст"
                  value={content.bookingCard.secondaryLabel}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      bookingCard: { ...content.bookingCard, secondaryLabel: v },
                    })
                  }
                />
              </>
            ) : null}

            {tab === "finalCta" ? (
              <>
                <Field
                  label="Заголовок"
                  value={content.finalCta.title}                  onChange={(v) =>
                    setContent({ ...content, finalCta: { ...content.finalCta, title: v } })
                  }
                />
                <Field
                  label="Лид"
                  value={content.finalCta.lead}
                  onChange={(v) =>
                    setContent({ ...content, finalCta: { ...content.finalCta, lead: v } })
                  }
                  multiline
                />
                <Field
                  label="Кнопка — текст"
                  value={content.finalCta.primaryCta.label}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      finalCta: {
                        ...content.finalCta,
                        primaryCta: { ...content.finalCta.primaryCta, label: v },
                      },
                    })
                  }
                />
                <Field
                  label="Кнопка — ссылка"
                  value={content.finalCta.primaryCta.href}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      finalCta: {
                        ...content.finalCta,
                        primaryCta: { ...content.finalCta.primaryCta, href: v },
                      },
                    })
                  }
                />
                <Field
                  label="Telegram — текст"
                  value={content.finalCta.secondaryCtaLabel}
                  onChange={(v) =>
                    setContent({ ...content, finalCta: { ...content.finalCta, secondaryCtaLabel: v } })
                  }
                />
              </>
            ) : null}

            {tab === "booking" ? (
              <>
                <Field
                  label="Заголовок"
                  value={content.booking.title}
                  onChange={(v) =>
                    setContent({ ...content, booking: { ...content.booking, title: v } })
                  }
                />
                <Field
                  label="Лид"
                  value={content.booking.lead}
                  onChange={(v) =>
                    setContent({ ...content, booking: { ...content.booking, lead: v } })
                  }
                  multiline
                />
                <Field
                  label="Текст согласия"
                  value={content.booking.privacy}
                  onChange={(v) =>
                    setContent({ ...content, booking: { ...content.booking, privacy: v } })
                  }
                  multiline
                />
                <Field
                  label="Текст кнопки отправки"
                  value={content.booking.submitLabel}
                  onChange={(v) =>
                    setContent({ ...content, booking: { ...content.booking, submitLabel: v } })
                  }
                />
              </>
            ) : null}

            {tab === "footer" ? (
              <>
                <Field
                  label="Примечание"
                  value={content.footer.note}
                  onChange={(v) =>
                    setContent({ ...content, footer: { ...content.footer, note: v } })
                  }
                  multiline
                />
                <Field
                  label="Кризисная строка"
                  value={content.footer.crisis}
                  onChange={(v) =>
                    setContent({ ...content, footer: { ...content.footer, crisis: v } })
                  }
                  multiline
                />
              </>
            ) : null}

            {tab === "bookings" ? (
              bookings.length === 0 ? (
                <p className="text-sm text-ink-soft">Заявок пока нет.</p>
              ) : (
                <ul className="divide-y divide-line border-y border-line">
                  {bookings.map((item) => (
                    <li key={item.id} className="py-4 text-sm">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-medium text-ink">{item.name}</p>
                        <time className="text-xs text-ink-soft">
                          {new Date(item.createdAt).toLocaleString("ru-RU")}
                        </time>
                      </div>
                      <p className="mt-1 text-ink-soft">{item.contact}</p>
                      <p className="mt-1 text-ink-soft">
                        {item.format} · {item.timeWindow}
                      </p>
                      {item.message ? (
                        <p className="mt-2 text-ink">{item.message}</p>
                      ) : null}
                      <p className="mt-2 text-xs text-clay-deep">{item.id}</p>
                    </li>
                  ))}
                </ul>
              )
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
