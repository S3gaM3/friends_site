import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultContent } from "@/content/defaults";
import { buildJsonLd, buildRootMetadata } from "@/lib/seo";

describe("buildRootMetadata", () => {
  it("includes robots, canonical and keywords", () => {
    const metadata = buildRootMetadata(defaultContent);
    assert.equal(metadata.alternates?.canonical, "/");
    assert.ok(Array.isArray(metadata.keywords));
    assert.ok((metadata.keywords as string[]).includes("психолог"));
    assert.equal(metadata.openGraph?.locale, "ru_RU");
    assert.equal(metadata.twitter?.card, "summary_large_image");
  });
});

describe("buildJsonLd", () => {
  it("returns Person, ProfessionalService and WebSite", () => {
    const data = buildJsonLd(defaultContent);
    const types = data.map((item) => item["@type"]);
    assert.deepEqual(types, ["Person", "ProfessionalService", "WebSite"]);
    assert.equal(data[0]?.name, defaultContent.site.name);
  });
});
