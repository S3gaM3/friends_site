import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { defaultContent } from "@/content/defaults";
import type { SiteContent } from "@/content/types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_PATH = path.join(DATA_DIR, "content.json");

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeCta(
  base: { href: string; label: string },
  raw: unknown,
): { href: string; label: string } {
  return { ...base, ...(isObject(raw) ? raw : {}) } as { href: string; label: string };
}

/** Мягкий merge: недостающие ключи подтягиваются из defaults. */
export function mergeWithDefaults(raw: unknown): SiteContent {
  const base = structuredClone(defaultContent);
  if (!isObject(raw)) return base;

  const rawHero = isObject(raw.hero) ? raw.hero : {};
  const rawAboutTeaser = isObject(raw.aboutTeaser) ? raw.aboutTeaser : {};
  const rawFinalCta = isObject(raw.finalCta) ? raw.finalCta : {};
  const rawBookingCard = isObject(raw.bookingCard) ? raw.bookingCard : {};
  const rawTestimonials = isObject(raw.testimonials) ? raw.testimonials : {};
  const rawTrustStrip = isObject(raw.trustStrip) ? raw.trustStrip : {};
  const rawRecognize = isObject(raw.recognizeSelf) ? raw.recognizeSelf : {};
  const rawTopics = isObject(raw.topics) ? raw.topics : {};
  const rawApproach = isObject(raw.approach) ? raw.approach : {};
  const rawHole = isObject(raw.hole) ? raw.hole : {};
  const rawTrust = isObject(raw.trustTimeline) ? raw.trustTimeline : {};
  const rawBarrier = isObject(raw.barrier) ? raw.barrier : {};
  const rawFirst = isObject(raw.firstMeeting) ? raw.firstMeeting : {};
  const rawStart = isObject(raw.startChooser) ? raw.startChooser : {};
  const rawFaq = isObject(raw.faq) ? raw.faq : {};
  const rawBooking = isObject(raw.booking) ? raw.booking : {};

  return {
    ...base,
    ...raw,
    site: { ...base.site, ...(isObject(raw.site) ? raw.site : {}) },
    nav: Array.isArray(raw.nav) ? (raw.nav as SiteContent["nav"]) : base.nav,
    hero: {
      ...base.hero,
      ...rawHero,
      primaryCta: mergeCta(base.hero.primaryCta, rawHero.primaryCta),
      secondaryCta: mergeCta(base.hero.secondaryCta, rawHero.secondaryCta),
      trustChips: Array.isArray(rawHero.trustChips)
        ? (rawHero.trustChips as SiteContent["hero"]["trustChips"])
        : base.hero.trustChips,
    },
    recognizeSelf: {
      ...base.recognizeSelf,
      ...rawRecognize,
      items: Array.isArray(rawRecognize.items)
        ? (rawRecognize.items as string[])
        : base.recognizeSelf.items,
    },
    topics: {
      ...base.topics,
      ...rawTopics,
      items: Array.isArray(rawTopics.items)
        ? (rawTopics.items as SiteContent["topics"]["items"])
        : base.topics.items,
    },
    approach: {
      ...base.approach,
      ...rawApproach,
      paragraphs: Array.isArray(rawApproach.paragraphs)
        ? (rawApproach.paragraphs as string[])
        : base.approach.paragraphs,
      flow: Array.isArray(rawApproach.flow) ? (rawApproach.flow as string[]) : base.approach.flow,
      methods: Array.isArray(rawApproach.methods)
        ? (rawApproach.methods as string[])
        : base.approach.methods,
    },
    hole: { ...base.hole, ...rawHole },
    trustTimeline: {
      ...base.trustTimeline,
      ...rawTrust,
      steps: Array.isArray(rawTrust.steps) ? (rawTrust.steps as string[]) : base.trustTimeline.steps,
    },
    barrier: {
      ...base.barrier,
      ...rawBarrier,
      paragraphs: Array.isArray(rawBarrier.paragraphs)
        ? (rawBarrier.paragraphs as string[])
        : base.barrier.paragraphs,
    },
    firstMeeting: {
      ...base.firstMeeting,
      ...rawFirst,
      steps: Array.isArray(rawFirst.steps)
        ? (rawFirst.steps as SiteContent["firstMeeting"]["steps"])
        : base.firstMeeting.steps,
      cta: mergeCta(base.firstMeeting.cta, rawFirst.cta),
    },
    startChooser: {
      ...base.startChooser,
      ...rawStart,
      options: Array.isArray(rawStart.options)
        ? (rawStart.options as SiteContent["startChooser"]["options"])
        : base.startChooser.options,
      cta: mergeCta(base.startChooser.cta, rawStart.cta),
    },
    faq: {
      ...base.faq,
      ...rawFaq,
      items: Array.isArray(rawFaq.items)
        ? (rawFaq.items as SiteContent["faq"]["items"])
        : base.faq.items,
    },
    trustStrip: {
      ...base.trustStrip,
      ...rawTrustStrip,
      items: Array.isArray(rawTrustStrip.items)
        ? (rawTrustStrip.items as SiteContent["trustStrip"]["items"])
        : base.trustStrip.items,
    },
    recognition: {
      ...base.recognition,
      ...(isObject(raw.recognition) ? raw.recognition : {}),
      scenes: Array.isArray((raw.recognition as { scenes?: unknown })?.scenes)
        ? (raw.recognition as { scenes: SiteContent["recognition"]["scenes"] }).scenes
        : base.recognition.scenes,
    },
    shift: {
      ...base.shift,
      ...(isObject(raw.shift) ? raw.shift : {}),
      outcomes: Array.isArray((raw.shift as { outcomes?: unknown })?.outcomes)
        ? (raw.shift as { outcomes: SiteContent["shift"]["outcomes"] }).outcomes
        : base.shift.outcomes,
    },
    aboutTeaser: {
      ...base.aboutTeaser,
      ...rawAboutTeaser,
      cta: mergeCta(base.aboutTeaser.cta, rawAboutTeaser.cta),
    },
    process: {
      ...base.process,
      ...(isObject(raw.process) ? raw.process : {}),
      steps: Array.isArray((raw.process as { steps?: unknown })?.steps)
        ? (raw.process as { steps: SiteContent["process"]["steps"] }).steps
        : base.process.steps,
    },
    services: {
      ...base.services,
      ...(isObject(raw.services) ? raw.services : {}),
      items: Array.isArray((raw.services as { items?: unknown })?.items)
        ? (raw.services as { items: SiteContent["services"]["items"] }).items
        : base.services.items,
    },
    testimonials: {
      ...base.testimonials,
      ...rawTestimonials,
      items: Array.isArray(rawTestimonials.items)
        ? (rawTestimonials.items as SiteContent["testimonials"]["items"])
        : base.testimonials.items,
    },
    bookingCard: {
      ...base.bookingCard,
      ...rawBookingCard,
      primaryCta: mergeCta(base.bookingCard.primaryCta, rawBookingCard.primaryCta),
    },
    finalCta: {
      ...base.finalCta,
      ...rawFinalCta,
      primaryCta: mergeCta(base.finalCta.primaryCta, rawFinalCta.primaryCta),
    },
    about: {
      ...base.about,
      ...(isObject(raw.about) ? raw.about : {}),
      paragraphs: Array.isArray((raw.about as { paragraphs?: unknown })?.paragraphs)
        ? (raw.about as { paragraphs: string[] }).paragraphs
        : base.about.paragraphs,
      facts: Array.isArray((raw.about as { facts?: unknown })?.facts)
        ? (raw.about as { facts: SiteContent["about"]["facts"] }).facts
        : base.about.facts,
    },
    booking: {
      ...base.booking,
      ...rawBooking,
    },
    footer: { ...base.footer, ...(isObject(raw.footer) ? raw.footer : {}) },
  } as SiteContent;
}

export class ContentRepository {
  async read(): Promise<SiteContent> {
    await ensureDataDir();
    try {
      const raw = await readFile(CONTENT_PATH, "utf8");
      return mergeWithDefaults(JSON.parse(raw) as unknown);
    } catch {
      const seed = structuredClone(defaultContent);
      await this.write(seed);
      return seed;
    }
  }

  async write(content: SiteContent): Promise<void> {
    await ensureDataDir();
    await writeFile(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  }
}

export const contentRepository = new ContentRepository();
