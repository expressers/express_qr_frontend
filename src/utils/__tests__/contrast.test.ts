/// <reference types="bun" />
import { describe, expect, it } from "bun:test";
import {
  contrastRatio,
  hasEnoughContrast,
  isHexColor,
  normalizeHex,
  relativeLuminance,
} from "../contrast";

describe("contrast", () => {
  it("black on white is 21:1", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 5);
  });

  it("same colour is 1:1", () => {
    expect(contrastRatio("#777777", "#777777")).toBeCloseTo(1, 5);
  });

  it("matches the known WCAG value for #767676 on white (4.54:1)", () => {
    expect(contrastRatio("#767676", "#FFFFFF")).toBeCloseTo(4.54, 2);
  });

  it("blocks below 4.5:1 and allows at or above it", () => {
    expect(hasEnoughContrast({ dark: "#777777", light: "#FFFFFF" })).toBe(false);
    expect(hasEnoughContrast({ dark: "#767676", light: "#FFFFFF" })).toBe(true);
    expect(hasEnoughContrast({ dark: "#FFFFFF", light: "#000000" })).toBe(true);
  });

  it("never passes with an invalid hex", () => {
    expect(hasEnoughContrast({ dark: "#12", light: "#FFFFFF" })).toBe(false);
  });

  it("validates and normalises hex input", () => {
    expect(isHexColor("#a1B2c3")).toBe(true);
    expect(isHexColor("a1b2c3")).toBe(false);
    expect(normalizeHex("a1b2c3")).toBe("#A1B2C3");
    expect(normalizeHex("#abc")).toBe("#AABBCC");
    expect(normalizeHex("#abcd")).toBeNull();
    expect(normalizeHex("zzz")).toBeNull();
  });

  it("luminance of pure channels follows the WCAG weights", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#FF0000")).toBeCloseTo(0.2126, 4);
  });
});
