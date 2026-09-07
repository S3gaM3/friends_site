import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isSafeHref, requireSafeHref } from "./safeUrl";

describe("isSafeHref", () => {
  it("allows relative and hash links", () => {
    assert.equal(isSafeHref("/booking"), true);
    assert.equal(isSafeHref("/#recognition"), true);
    assert.equal(isSafeHref("#top"), true);
  });

  it("allows http(s), mailto, tel", () => {
    assert.equal(isSafeHref("https://t.me/username"), true);
    assert.equal(isSafeHref("http://example.com"), true);
    assert.equal(isSafeHref("mailto:a@b.c"), true);
    assert.equal(isSafeHref("tel:+79001234567"), true);
  });

  it("rejects dangerous schemes", () => {
    assert.equal(isSafeHref("javascript:alert(1)"), false);
    assert.equal(isSafeHref("data:text/html,hi"), false);
    assert.equal(isSafeHref(""), false);
    assert.equal(isSafeHref("not a url"), false);
  });

  it("requireSafeHref throws on bad input", () => {
    assert.throws(() => requireSafeHref("javascript:void(0)", "CTA"), /недопустимую ссылку/);
  });
});
