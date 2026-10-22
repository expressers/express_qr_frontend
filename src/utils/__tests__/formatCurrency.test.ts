/// <reference types="bun" />
import { describe, it, expect } from "bun:test";
import { formatCurrency } from "../formatCurrency";

describe("formatCurrency", () => {
  it("formats USD in en-US by default", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats zero with two decimals", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative values", () => {
    expect(formatCurrency(-5)).toBe("-$5.00");
  });

  it("honours a custom currency and locale", () => {
    expect(formatCurrency(10, "en-US", "EUR")).toBe("€10.00");
  });
});
