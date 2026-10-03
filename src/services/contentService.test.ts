import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergeWithDefaults } from "../repositories/contentRepository";
import { normalizeContentInput } from "../services/contentService";
import { defaultContent } from "../content/defaults";

describe("mergeWithDefaults", () => {
  it("returns defaults for empty input", () => {
    const merged = mergeWithDefaults(null);
    assert.equal(merged.site.name, defaultContent.site.name);
    assert.equal(merged.hero.headline, defaultContent.hero.headline);
  });

  it("fills portrait and testimonials from defaults", () => {
    const merged = mergeWithDefaults({ site: { name: "Тест" } });
    assert.ok(merged.site.portraitSrc);
    assert.ok(Array.isArray(merged.testimonials.items));
    assert.ok(merged.bookingCard.price);
    assert.ok(merged.trustStrip.items.length >= 1);
  });

  it("fills recommendations and seo from defaults", () => {
    const merged = mergeWithDefaults({ site: { name: "Тест" } });
    assert.equal(merged.recommendations.title, defaultContent.recommendations.title);
    assert.ok(Array.isArray(merged.recommendations.items));
    assert.ok(merged.seo.keywords.length >= 1);
  });
});

describe("normalizeContentInput", () => {
  it("accepts default content", () => {
    const content = normalizeContentInput(defaultContent);
    assert.equal(content.site.name, defaultContent.site.name);
  });

  it("rejects javascript href", () => {
    assert.throws(
      () =>
        normalizeContentInput({
          ...defaultContent,
          hero: {
            ...defaultContent.hero,
            primaryCta: { href: "javascript:alert(1)", label: "x" },
          },
        }),
      /недопустимую ссылку/,
    );
  });

  it("rejects empty required fields", () => {
    assert.throws(
      () =>
        normalizeContentInput({
          ...defaultContent,
          site: { ...defaultContent.site, name: "   " },
        }),
      /обязательно/,
    );
  });

  it("accepts recommendations specialists with safe href", () => {
    const content = normalizeContentInput({
      ...defaultContent,
      recommendations: {
        title: "Кого советую",
        lead: "Знакомые специалисты",
        items: [
          {
            id: "s1",
            name: "Анна",
            role: "Психолог",
            description: "Работает с тревогой",
            href: "https://example.com",
            ctaLabel: "Сайт",
          },
        ],
      },
    });
    assert.equal(content.recommendations.items.length, 1);
    assert.equal(content.recommendations.items[0]?.href, "https://example.com");
  });

  it("rejects unsafe recommendation href", () => {
    assert.throws(
      () =>
        normalizeContentInput({
          ...defaultContent,
          recommendations: {
            title: "Кого советую",
            lead: "",
            items: [
              {
                id: "s1",
                name: "Анна",
                role: "Психолог",
                description: "Текст",
                href: "javascript:alert(1)",
                ctaLabel: "Сайт",
              },
            ],
          },
        }),
      /недопустимую ссылку/,
    );
  });
});
