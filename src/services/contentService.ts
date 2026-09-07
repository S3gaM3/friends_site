import type { SiteContent } from "@/content/types";
import { requireSafeHref } from "@/lib/safeUrl";
import { contentRepository, mergeWithDefaults } from "@/repositories/contentRepository";

const MAX_SHORT = 200;
const MAX_MEDIUM = 2_000;
const MAX_LONG = 8_000;

function requireString(value: unknown, field: string, max = MAX_MEDIUM): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Поле «${field}» обязательно.`);
  }
  if (value.length > max) {
    throw new Error(`Поле «${field}» слишком длинное.`);
  }
  return value;
}

function requireOptionalString(value: unknown, field: string, max = MAX_MEDIUM): string {
  if (typeof value !== "string") {
    throw new Error(`Поле «${field}» должно быть строкой.`);
  }
  if (value.length > max) {
    throw new Error(`Поле «${field}» слишком длинное.`);
  }
  return value;
}

function assertTitleTextList(
  items: unknown,
  field: string,
  min: number,
): asserts items is { title: string; text: string }[] {
  if (!Array.isArray(items) || items.length < min) {
    throw new Error(`Раздел «${field}» должен содержать хотя бы ${min} элемент(а).`);
  }
  for (const [index, item] of items.entries()) {
    if (!item || typeof item !== "object") {
      throw new Error(`Элемент «${field}[${index}]» некорректен.`);
    }
    requireString((item as { title?: unknown }).title, `${field}[${index}].title`, MAX_SHORT);
    requireString((item as { text?: unknown }).text, `${field}[${index}].text`, MAX_LONG);
  }
}

/** Валидация и нормализация контента перед записью в хранилище. */
export function normalizeContentInput(input: unknown): SiteContent {
  if (!input || typeof input !== "object") {
    throw new Error("Некорректное тело запроса.");
  }

  const content = mergeWithDefaults(input);

  requireString(content.site.name, "Имя", MAX_SHORT);
  requireString(content.site.firstName, "Имя коротко", MAX_SHORT);
  requireString(content.site.portraitAlt, "Подпись портрета", MAX_MEDIUM);
  content.site.portraitSrc = requireSafeHref(content.site.portraitSrc, "Путь к\u00A0портрету");

  requireString(content.hero.headline, "Заголовок hero", MAX_MEDIUM);
  requireString(content.hero.support, "Подзаголовок hero", MAX_LONG);
  requireString(content.hero.metaLine, "Мета hero", MAX_MEDIUM);

  content.site.telegram = requireSafeHref(content.site.telegram, "Telegram URL");
  content.site.email = requireOptionalString(content.site.email, "Email", MAX_SHORT);
  if (content.site.email) {
    content.site.email = requireSafeHref(
      `mailto:${content.site.email.replace(/^mailto:/i, "")}`,
      "Email",
    ).replace(/^mailto:/i, "");
  }
  content.site.whatsapp = requireOptionalString(content.site.whatsapp, "WhatsApp URL", MAX_MEDIUM);
  if (content.site.whatsapp) {
    content.site.whatsapp = requireSafeHref(content.site.whatsapp, "WhatsApp URL");
  }
  if (content.site.aboutPortraitSrc) {
    content.site.aboutPortraitSrc = requireSafeHref(
      content.site.aboutPortraitSrc,
      "Путь ко\u00A0второму портрету",
    );
  }

  content.hero.primaryCta.href = requireSafeHref(content.hero.primaryCta.href, "Hero CTA");
  content.hero.secondaryCta.href = requireSafeHref(content.hero.secondaryCta.href, "Hero secondary CTA");
  content.finalCta.primaryCta.href = requireSafeHref(content.finalCta.primaryCta.href, "Final CTA");
  content.startChooser.cta.href = requireSafeHref(content.startChooser.cta.href, "Start chooser CTA");
  content.aboutTeaser.cta.href = requireSafeHref(content.aboutTeaser.cta.href, "About teaser CTA");
  content.bookingCard.primaryCta.href = requireSafeHref(
    content.bookingCard.primaryCta.href,
    "Booking card CTA",
  );

  for (const [index, item] of content.nav.entries()) {
    requireString(item.label, `nav[${index}].label`, MAX_SHORT);
    item.href = requireSafeHref(item.href, `nav[${index}].href`);
  }

  if (!Array.isArray(content.hero.trustChips) || content.hero.trustChips.length < 1) {
    throw new Error("Нужен хотя бы один trust-chip.");
  }

  requireString(content.recognizeSelf.title, "recognizeSelf.title", MAX_SHORT);
  if (!Array.isArray(content.recognizeSelf.items) || content.recognizeSelf.items.length < 1) {
    throw new Error("Нужны пункты «узнаёте себя».");
  }

  assertTitleTextList(content.topics.items, "topics.items", 1);
  assertTitleTextList(content.firstMeeting.steps, "firstMeeting.steps", 1);
  assertTitleTextList(content.trustStrip.items, "trustStrip.items", 1);
  assertTitleTextList(content.recognition.scenes, "recognition.scenes", 1);
  assertTitleTextList(content.shift.outcomes, "shift.outcomes", 1);
  assertTitleTextList(content.process.steps, "process.steps", 1);

  if (!Array.isArray(content.approach.flow) || content.approach.flow.length < 1) {
    throw new Error("Нужна схема подхода.");
  }
  if (!Array.isArray(content.faq.items) || content.faq.items.length < 1) {
    throw new Error("Нужен хотя бы один FAQ.");
  }
  if (!Array.isArray(content.startChooser.options) || content.startChooser.options.length < 1) {
    throw new Error("Нужны варианты startChooser.");
  }

  if (!Array.isArray(content.services.items) || content.services.items.length < 1) {
    throw new Error("Нужна хотя бы одна услуга.");
  }
  for (const [index, item] of content.services.items.entries()) {
    requireString(item.id, `services[${index}].id`, MAX_SHORT);
    requireString(item.title, `services[${index}].title`, MAX_SHORT);
    requireOptionalString(item.description, `services[${index}].description`, MAX_LONG);
  }

  requireString(content.testimonials.title, "Заголовок отзывов", MAX_SHORT);
  if (!Array.isArray(content.testimonials.items)) {
    throw new Error("Список отзывов должен быть массивом.");
  }

  requireString(content.booking.title, "Заголовок записи", MAX_SHORT);
  requireString(content.booking.submitLabel, "Кнопка записи", MAX_SHORT);
  requireString(content.footer.note, "Примечание подвала", MAX_LONG);

  if (!Array.isArray(content.about.paragraphs) || content.about.paragraphs.length < 1) {
    throw new Error("Нужен хотя бы один абзац «Обо\u00A0мне».");
  }

  return content;
}

export class ContentService {
  constructor(private readonly repo = contentRepository) {}

  async getContent(): Promise<SiteContent> {
    return this.repo.read();
  }

  async saveContent(input: unknown): Promise<SiteContent> {
    const content = normalizeContentInput(input);
    await this.repo.write(content);
    return content;
  }
}

export const contentService = new ContentService();
