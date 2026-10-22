/// <reference types="bun" />
import { describe, expect, it } from "bun:test";
import { PLACEHOLDER_SLUG, previewContent } from "../qrPreview";

const origin = "https://app.test";

describe("previewContent", () => {
  it("dynamic uses the short URL pattern with a placeholder slug", () => {
    expect(previewContent({ type: "DYNAMIC", draft: "https://x.y", origin })).toEqual({
      content: `${origin}/r/${PLACEHOLDER_SLUG}`,
      sample: false,
    });
  });
  it("dynamic uses the real slug once it exists", () => {
    expect(previewContent({ type: "DYNAMIC", draft: "", slug: "k3j9Zq1", origin }).content).toBe(
      `${origin}/r/k3j9Zq1`,
    );
  });
  it("static mirrors what is typed", () => {
    expect(previewContent({ type: "STATIC", draft: "  hello  " })).toEqual({
      content: "hello",
      sample: false,
    });
  });
  it("static falls back to a neutral sample while empty", () => {
    const result = previewContent({ type: "STATIC", draft: "   " });
    expect(result.sample).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
  });
});
