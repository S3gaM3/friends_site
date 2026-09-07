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
});
