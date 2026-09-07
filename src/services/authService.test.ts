import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { AuthService } from "../services/authService";

describe("AuthService.verifyPassword", () => {
  const previousPassword = process.env.ADMIN_PASSWORD;
  const previousSecret = process.env.ADMIN_SECRET;

  afterEach(() => {
    if (previousPassword === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = previousPassword;

    if (previousSecret === undefined) delete process.env.ADMIN_SECRET;
    else process.env.ADMIN_SECRET = previousSecret;
  });

  it("matches the configured password", () => {
    process.env.ADMIN_PASSWORD = "correct-horse";
    process.env.ADMIN_SECRET = "long-enough-secret!";
    const auth = new AuthService();
    assert.equal(auth.verifyPassword("correct-horse"), true);
    assert.equal(auth.verifyPassword("wrong"), false);
    assert.equal(auth.isConfigured(), true);
  });

  it("is not configured without password", () => {
    process.env.ADMIN_PASSWORD = "";
    process.env.ADMIN_SECRET = "long-enough-secret!";
    const auth = new AuthService();
    assert.equal(auth.isConfigured(), false);
    assert.equal(auth.verifyPassword("anything"), false);
  });
});
