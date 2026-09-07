"use client";

import { FormEvent, useState } from "react";
import type { BookingContent, SiteProfile } from "@/content/types";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "loading" | "success" | "error";

const isStaticDemo = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const fieldClass =
  "mt-2 w-full rounded-[var(--radius)] border border-line bg-white px-4 py-3 text-ink outline-none transition-shadow placeholder:text-ink-soft/60 focus:border-clay focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--sand)_55%,transparent)]";

const labelClass = "block text-sm font-medium text-ink";

function telegramComposeUrl(siteTelegram: string, name: string, contact: string, message: string) {
  const text = [
    "Здравствуйте! Хочу записаться на бесплатные 15 минут.",
    `Имя: ${name}`,
    `Мой Telegram: ${contact}`,
    message ? `Коротко: ${message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const base = siteTelegram.replace(/\/$/, "");
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function BookingForm({
  booking,
  site,
}: {
  booking: BookingContent;
  site: SiteProfile;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [bookingId, setBookingId] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      contact: String(formData.get("contact") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      consent: formData.get("consent") === "on",
    };

    const nextErrors: Record<string, string> = {};
    if (!payload.name) nextErrors.name = "Укажите имя.";
    if (!payload.contact) nextErrors.contact = "Укажите Telegram (@username или ссылку).";
    if (!payload.consent) nextErrors.consent = "Нужно согласие на обработку данных.";
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setStatus("error");
      setError("Проверьте поля формы.");
      return;
    }

    // GitHub Pages / статическое демо — без серверного API, открываем Telegram.
    if (isStaticDemo) {
      window.open(
        telegramComposeUrl(site.telegram, payload.name, payload.contact, payload.message),
        "_blank",
        "noopener,noreferrer",
      );
      setStatus("success");
      setBookingId("telegram");
      form.reset();
      return;
    }

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok: boolean;
        id?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "Не удалось отправить заявку.");
        setFieldErrors(data.fieldErrors ?? {});
        return;
      }

      setBookingId(data.id ?? null);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Сеть недоступна. Попробуйте ещё раз или напишите в\u00A0Telegram.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-[calc(var(--radius)+4px)] border border-clay/30 bg-white px-6 py-10 text-center"
        role="status"
      >
        <p className="display text-2xl text-ink">
          {isStaticDemo || bookingId === "telegram" ? "Открыл Telegram" : "Заявка принята"}
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          {isStaticDemo || bookingId === "telegram"
            ? "Если окно не открылось — напишите напрямую @d_shandalov. Можно отправить ещё одну заявку."
            : `Скоро напишу в Telegram и предложу время. Номер заявки: ${bookingId}`}
        </p>
        <Button
          className="mt-8"
          variant="ghost"
          onClick={() => {
            setStatus("idle");
            setBookingId(null);
          }}
        >
          Отправить ещё одну
        </Button>
      </div>
    );
  }

  return (
    <form id="form" onSubmit={onSubmit} className="space-y-6" noValidate>
      {isStaticDemo ? (
        <p className="rounded-[var(--radius)] border border-line bg-sand/50 px-4 py-3 text-sm text-ink-soft">
          Демо-версия: заявка откроет Telegram с готовым текстом сообщения.
        </p>
      ) : null}

      <div>
        <label htmlFor="name" className={labelClass}>
          Как вас зовут?
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          className={fieldClass}
          placeholder="Имя"
        />
        {fieldErrors.name ? <p className="mt-1.5 text-sm text-red-700">{fieldErrors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="contact" className={labelClass}>
          Telegram
        </label>
        <input
          id="contact"
          name="contact"
          autoComplete="username"
          required
          className={fieldClass}
          placeholder="@username"
        />
        {fieldErrors.contact ? (
          <p className="mt-1.5 text-sm text-red-700">{fieldErrors.contact}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {"Если хотите, коротко расскажите, что вас привело"}{" "}
          <span className="font-normal text-ink-soft">(необязательно)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`${fieldClass} resize-y`}
          placeholder="Можно одной фразой"
        />
        {fieldErrors.message ? (
          <p className="mt-1.5 text-sm text-red-700">{fieldErrors.message}</p>
        ) : null}
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
        <input type="checkbox" name="consent" required className="mt-1 accent-clay-deep" />
        <span>{booking.privacy}</span>
      </label>
      {fieldErrors.consent ? <p className="text-sm text-red-700">{fieldErrors.consent}</p> : null}

      {error ? (
        <p
          className="rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
          {status === "loading" ? "Отправляю…" : booking.submitLabel}
        </Button>
        <Button href={site.telegram} variant="link">
          Или сразу в\u00A0Telegram
        </Button>
      </div>
    </form>
  );
}
