/// <reference types="bun" />
import { describe, it, expect } from "bun:test";
import { userNameParts } from "../nameParts";

describe("userNameParts", () => {
  it("returns the two initials of a full name in upper case", () => {
    expect(userNameParts("ana maria")).toBe("AM");
  });

  it("returns a single initial for a one-word name", () => {
    expect(userNameParts("Eladio")).toBe("E");
  });

  it("uses only the first two words", () => {
    expect(userNameParts("João Pedro Silva")).toBe("JP");
  });

  it("falls back to the brand initial when the name is null", () => {
    expect(userNameParts(null)).toBe("EQ");
  });

  it("falls back to the brand initial for an empty name", () => {
    expect(userNameParts("")).toBe("EQ");
  });
});
