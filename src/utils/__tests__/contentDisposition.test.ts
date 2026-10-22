/// <reference types="bun" />
import { describe, expect, it } from "bun:test";
import { parseContentDispositionFilename } from "@/service/api/contentDisposition";

describe("parseContentDispositionFilename", () => {
  it("reads quoted and bare filenames", () => {
    expect(parseContentDispositionFilename('attachment; filename="expressqr-abc.png"')).toBe("expressqr-abc.png");
    expect(parseContentDispositionFilename("attachment; filename=expressqr.svg")).toBe("expressqr.svg");
  });

  it("prefers RFC 5987 filename*", () => {
    expect(
      parseContentDispositionFilename(`attachment; filename="a.pdf"; filename*=UTF-8''caf%C3%A9.pdf`),
    ).toBe("café.pdf");
  });

  it("strips path separators and returns null when absent", () => {
    expect(parseContentDispositionFilename('attachment; filename="../../x.png"')).toBe("....x.png");
    expect(parseContentDispositionFilename("attachment")).toBeNull();
    expect(parseContentDispositionFilename(null)).toBeNull();
  });
});
