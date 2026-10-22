/// <reference types="bun" />
import { describe, expect, it } from "bun:test";
import { getSafeRedirectUrl, isHttpUrl } from "../safeUrl";

describe("getSafeRedirectUrl", () => {
  it("accepts absolute http(s) URLs", () => {
    expect(getSafeRedirectUrl("https://example.org/a?b=1")).toBe("https://example.org/a?b=1");
    expect(getSafeRedirectUrl("http://example.org")).toBe("http://example.org/");
  });

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    " javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "//evil.example",
    "/relative",
    "example.org",
    "",
  ])("rejects %p", (value) => {
    expect(getSafeRedirectUrl(value)).toBeNull();
    expect(isHttpUrl(value)).toBe(false);
  });

  it("rejects non-strings", () => {
    expect(getSafeRedirectUrl(undefined)).toBeNull();
    expect(getSafeRedirectUrl(42)).toBeNull();
  });
});
