/// <reference types="bun" />
import { describe, expect, it } from "bun:test";
import { ApiError } from "@/service/api/apiError";
import { applyFieldErrors, getErrorMessage, getFieldErrors } from "../errorMessage";

const errors = { RATE_LIMITED: "slow down", NETWORK_ERROR: "offline", PLAN_LIMIT_EXCEEDED: "limit" };

describe("getErrorMessage", () => {
  it("translates known codes", () => {
    expect(getErrorMessage(new ApiError("raw", 403, "PLAN_LIMIT_EXCEEDED"), errors, "fb")).toBe("limit");
  });

  it("uses the translated fallback for unknown codes, never the raw server text", () => {
    expect(getErrorMessage(new ApiError("Internal detail", 500, "WHATEVER"), errors, "fb")).toBe("fb");
  });

  it("maps 429 and network errors", () => {
    expect(getErrorMessage(new ApiError("x", 429, "HTTP_429"), errors, "fb")).toBe("slow down");
    expect(getErrorMessage(new TypeError("Failed to fetch"), errors, "fb")).toBe("offline");
  });
});

describe("field errors", () => {
  const validation = new ApiError("bad", 400, "VALIDATION_ERROR", {
    fields: { targetUrl: ["Invalid url"], title: [], other: ["x"] },
  });

  it("lists only fields with messages", () => {
    expect(getFieldErrors(validation)).toEqual(["targetUrl", "other"]);
    expect(getFieldErrors(new ApiError("x", 400, "OTHER", { fields: { a: ["b"] } }))).toEqual([]);
  });

  it("maps API fields to form fields", () => {
    const calls: [string, string][] = [];
    const applied = applyFieldErrors(
      validation,
      (name: "url", e) => calls.push([name, e.message]),
      { targetUrl: "url" },
      "Invalid",
    );
    expect(applied).toBe(true);
    expect(calls).toEqual([["url", "Invalid"]]);
  });
});
