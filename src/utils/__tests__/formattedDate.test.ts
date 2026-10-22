/// <reference types="bun" />
import { describe, it, expect } from "bun:test";
import { formattedDate } from "../formattedDate";

describe("formattedDate", () => {
  it("includes day and year of an ISO date (month rendering depends on ICU)", () => {
    const out = formattedDate("2025-03-15T12:00:00Z");
    expect(out).toContain("15");
    expect(out).toContain("2025");
  });

  it("zero-pads the day", () => {
    expect(formattedDate("2025-03-05T12:00:00Z")).toContain("05");
  });

  it("returns 'Invalid Date' for an unparsable string", () => {
    expect(formattedDate("not-a-date")).toBe("Invalid Date");
  });
});
