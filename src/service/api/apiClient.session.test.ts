/// <reference types="bun" />
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { installFakeLocation } from "@/test/fakeLocation";

// config.ts requires an API URL outside Vite dev mode.
process.env.VITE_API_URL ||= "http://api.test";
const { default: apiClient, ApiError } = await import("./apiClient");

const realFetch = globalThis.fetch;
let loc: ReturnType<typeof installFakeLocation>;
let fetchCalls: number;

const respondWith = (status: number, code: string) => {
  globalThis.fetch = (async () => {
    fetchCalls += 1;
    return new Response(
      JSON.stringify({ success: false, error: { code, message: code, status, details: {} } }),
      { status, headers: { "content-type": "application/json" } },
    );
  }) as unknown as typeof fetch;
};

const seedSession = (expMs?: number) => {
  localStorage.setItem("auth_token", "tok");
  localStorage.setItem("user_me", "{}");
  if (expMs !== undefined) localStorage.setItem("auth_token_exp", String(expMs));
};

beforeEach(() => {
  fetchCalls = 0;
  loc = installFakeLocation("/dashboard/my-qrcodes");
});
afterEach(() => {
  globalThis.fetch = realFetch;
  loc.restore();
});

describe("apiClient 401 handling", () => {
  it("clears the session and redirects to sign-in on 401 UNAUTHORIZED", async () => {
    seedSession(Date.now() + 60_000);
    respondWith(401, "UNAUTHORIZED");
    await expect(apiClient.get("/api/qrcodes")).rejects.toBeInstanceOf(ApiError);
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("user_me")).toBeNull();
    expect(loc.navigations).toEqual(["/auth/signin"]);
  });

  it("keeps the session on 401 with another code (e.g. INVALID_CREDENTIALS)", async () => {
    seedSession(Date.now() + 60_000);
    respondWith(401, "INVALID_CREDENTIALS");
    await expect(apiClient.post("/api/sessions", {})).rejects.toMatchObject({ code: "INVALID_CREDENTIALS" });
    expect(localStorage.getItem("auth_token")).toBe("tok");
    expect(loc.navigations).toEqual([]);
  });

  it("keeps the session on 400 INVALID_CURRENT_PASSWORD", async () => {
    seedSession(Date.now() + 60_000);
    respondWith(400, "INVALID_CURRENT_PASSWORD");
    await expect(apiClient.post("/api/account/change-password", {})).rejects.toMatchObject({
      code: "INVALID_CURRENT_PASSWORD",
    });
    expect(localStorage.getItem("auth_token")).toBe("tok");
    expect(loc.navigations).toEqual([]);
  });

  it("does not redirect on 401 UNAUTHORIZED while already on an auth page", async () => {
    loc.setPathname("/auth/signin");
    seedSession(Date.now() + 60_000);
    respondWith(401, "UNAUTHORIZED");
    await expect(apiClient.get("/api/qrcodes")).rejects.toBeInstanceOf(ApiError);
    expect(loc.navigations).toEqual([]);
  });
});

describe("apiClient locally expired token", () => {
  it("clears the whole session and redirects without calling the server on a private page", async () => {
    seedSession(Date.now() - 1_000);
    respondWith(200, "OK");
    await expect(apiClient.get("/api/qrcodes")).rejects.toBeInstanceOf(ApiError);
    expect(fetchCalls).toBe(0);
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_token_exp")).toBeNull();
    expect(localStorage.getItem("user_me")).toBeNull();
    expect(loc.navigations).toEqual(["/auth/signin"]);
  });

  it("getAuthToken returns null and clears the session when the token has expired", () => {
    seedSession(Date.now() - 1_000);
    expect(apiClient.getAuthToken()).toBeNull();
    expect(localStorage.getItem("user_me")).toBeNull();
  });

  it("getAuthToken returns the token while it is still valid", () => {
    seedSession(Date.now() + 60_000);
    expect(apiClient.getAuthToken()).toBe("tok");
  });
});
