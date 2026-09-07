import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { consumeRateLimit, resetRateLimits } from "./rateLimit";

describe("consumeRateLimit", () => {
  it("allows up to the limit then blocks", () => {
    resetRateLimits();
    assert.equal(consumeRateLimit("t", 2, 60_000).ok, true);
    assert.equal(consumeRateLimit("t", 2, 60_000).ok, true);
    const blocked = consumeRateLimit("t", 2, 60_000);
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.ok(blocked.retryAfterSec >= 1);
  });
});
