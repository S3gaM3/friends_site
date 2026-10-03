import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { absoluteUrl, getSiteUrl } from "./siteUrl";

const original = {
  SITE_URL: process.env.SITE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  GITHUB_PAGES: process.env.GITHUB_PAGES,
  GITHUB_PAGES_BASE_PATH: process.env.GITHUB_PAGES_BASE_PATH,
};

afterEach(() => {
  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("getSiteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL and strips trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://dshan.ru/";
    delete process.env.SITE_URL;
    delete process.env.GITHUB_PAGES;
    assert.equal(getSiteUrl(), "https://dshan.ru");
  });

  it("falls back to dshan.ru", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.SITE_URL;
    delete process.env.GITHUB_PAGES;
    assert.equal(getSiteUrl(), "https://dshan.ru");
  });
});

describe("absoluteUrl", () => {
  it("joins path to origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://dshan.ru";
    assert.equal(absoluteUrl("/booking"), "https://dshan.ru/booking");
    assert.equal(absoluteUrl("/"), "https://dshan.ru");
  });
});
