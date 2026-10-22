/// <reference types="bun" />
import { describe, it, expect, beforeEach, afterEach, spyOn, setSystemTime } from "bun:test";
import { CACHE } from "../cache";
import { CACHE_TTL } from "../cachettl";

describe("CACHE_TTL", () => {
  it("is five minutes in milliseconds", () => {
    expect(CACHE_TTL).toBe(300_000);
  });
});

describe("CACHE", () => {
  beforeEach(() => setSystemTime(new Date("2025-01-01T00:00:00Z")));
  afterEach(() => setSystemTime());

  it("returns null for a missing key", () => {
    expect(CACHE.get("missing", 1000)).toBeNull();
  });

  it("returns stored data while within the ttl", () => {
    CACHE.set("k", { a: 1 });
    setSystemTime(new Date("2025-01-01T00:00:00.500Z"));
    expect(CACHE.get<{ a: number }>("k", 1000)).toEqual({ a: 1 });
  });

  it("returns null and removes the entry once the ttl has elapsed", () => {
    CACHE.set("k", "v");
    setSystemTime(new Date("2025-01-01T00:00:02Z"));
    expect(CACHE.get("k", 1000)).toBeNull();
    expect(localStorage.getItem("k")).toBeNull();
  });

  it("returns null for corrupted JSON without throwing", () => {
    const spy = spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem("bad", "{not json");
    expect(CACHE.get("bad", 1000)).toBeNull();
    spy.mockRestore();
  });

  it("clear removes a single key", () => {
    CACHE.set("a", 1);
    CACHE.set("b", 2);
    CACHE.clear("a");
    expect(localStorage.getItem("a")).toBeNull();
    expect(localStorage.getItem("b")).not.toBeNull();
  });

  it("clearByPrefix removes only keys with the prefix", () => {
    CACHE.set("qr:1", 1);
    CACHE.set("qr:2", 2);
    CACHE.set("other", 3);
    CACHE.clearByPrefix("qr:");
    expect(localStorage.getItem("qr:1")).toBeNull();
    expect(localStorage.getItem("qr:2")).toBeNull();
    expect(localStorage.getItem("other")).not.toBeNull();
  });
});
