import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateBookingInput } from "../services/bookingService";

describe("validateBookingInput", () => {
  const valid = {
    name: "Анна",
    contact: "@anna",
    message: "Тревога",
    consent: true,
  };

  it("accepts a valid payload", () => {
    const result = validateBookingInput(valid);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.request.name, "Анна");
      assert.equal(result.request.contact, "@anna");
    }
  });

  it("requires consent", () => {
    const result = validateBookingInput({ ...valid, consent: false });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.ok(result.fieldErrors?.consent);
    }
  });

  it("rejects empty name", () => {
    const result = validateBookingInput({ ...valid, name: "  " });
    assert.equal(result.ok, false);
  });
});
