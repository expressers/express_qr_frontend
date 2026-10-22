import type { Page, Route } from "@playwright/test";

/** Must match VITE_API_URL used by playwright.config.ts webServer. */
export const API = "http://api.test";

export const ok = (data: unknown, status = 200) => ({
  status,
  contentType: "application/json",
  headers: { "access-control-allow-origin": "*" },
  body: JSON.stringify({ success: true, data }),
});

export const fail = (code: string, status: number, message = code, details: object = {}) => ({
  status,
  contentType: "application/json",
  headers: { "access-control-allow-origin": "*" },
  body: JSON.stringify({ success: false, error: { code, message, status, details } }),
});

const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");

/** Unsigned JWT-shaped token; the SPA only decodes `exp`. */
export const fakeToken = (expInSeconds = 3600) =>
  `${b64({ alg: "none", typ: "JWT" })}.${b64({
    sub: "user-1",
    email: "ana@test.local",
    role: "USER",
    exp: Math.floor(Date.now() / 1000) + expInSeconds,
  })}.sig`;

export async function loginAs(page: Page) {
  const token = fakeToken();
  // Seed once per tab: re-seeding on every navigation would resurrect a session the app cleared.
  await page.addInitScript((t) => {
    if (sessionStorage.getItem("__e2e_seeded")) return;
    sessionStorage.setItem("__e2e_seeded", "1");
    localStorage.setItem("auth_token", t);
  }, token);
}

export const qr = (over: Record<string, unknown> = {}) => ({
  id: "qr-1",
  type: "DYNAMIC",
  title: "Menu",
  description: null,
  tags: [],
  slug: "abc123",
  targetUrl: "https://example.com",
  staticContent: null,
  isActive: true,
  imageUrl: null,
  scanCount: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...over,
});

export const plan = (name = "FREE", displayName = "Free") => ({
  name,
  displayName,
  maxQrCodes: { STATIC: 10, DYNAMIC: 3 },
  features: { customColors: false, analytics: "basic" },
  analyticsWindowDays: 30,
});

/** Calls handler for any request under API/path; answers CORS preflight automatically. */
export async function mockApi(
  page: Page,
  routes: Record<string, (route: Route, url: URL) => unknown | Promise<unknown>>,
) {
  await page.route(`${API}/**`, async (route) => {
    const req = route.request();
    if (req.method() === "OPTIONS") {
      return route.fulfill({
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
          "access-control-allow-methods": "*",
        },
      });
    }
    const url = new URL(req.url());
    const key = `${req.method()} ${url.pathname}`;
    const handler = routes[key];
    if (!handler) return route.fulfill(fail("NOT_MOCKED", 404, `No mock for ${key}`));
    const res = await handler(route, url);
    if (res) await route.fulfill(res as Parameters<Route["fulfill"]>[0]);
  });
}

/** Mirrors the server: honours `take`, `skip` and `isActive` and reports the filtered total. */
export function qrListResponse(all: ReturnType<typeof qr>[], url: URL) {
  const isActive = url.searchParams.get("isActive");
  const take = Number(url.searchParams.get("take") ?? 50);
  const skip = Number(url.searchParams.get("skip") ?? 0);
  const filtered = isActive === null ? all : all.filter((q) => String(q.isActive) === isActive);
  return ok({ qrcodes: filtered.slice(skip, skip + take), total: filtered.length, take, skip });
}

export const defaultAuthedRoutes = {
  // Contract: GET /api/qrcodes accepts take, skip and isActive (filtered server-side).
  "GET /api/qrcodes": (_route: Route, url: URL) => qrListResponse([qr(), qr({ id: "qr-2", title: "Old", isActive: false })], url),
  "GET /api/plans/my-plan": () =>
    ok({
      plan: plan(),
      usage: { static: 0, dynamic: 1 },
      remaining: { static: 10, dynamic: 2 },
      subscription: null,
    }),
  "GET /api/plans": () => ok({ plans: [plan()] }),
  "GET /api/analytics/my-stats": () => ok({ overview: {}, series: [] }),
};

/** GET /api/account/me; `role` STAFF/ADMIN carries the management permission. */
export const meRoute = (role: "USER" | "STAFF" | "ADMIN" = "USER") => () =>
  ok({
    id: "user-1",
    email: "ana@test.local",
    firstName: "Ana",
    lastName: "Silva",
    role,
    permissions: role === "USER" ? ["qr:create"] : ["qr:create", "user:read:any", "audit:read"],
  });

/** Plan with the colours feature switched on or off. */
export const planWith = (customColors: boolean, name = customColors ? "PRO" : "FREE") => ({
  ...plan(name, name === "PRO" ? "Pro" : "Free"),
  features: { customColors, analytics: customColors ? "full" : "basic" },
});

export const myPlanRoute = (customColors: boolean) => () =>
  ok({
    plan: planWith(customColors),
    usage: { static: 0, dynamic: 0 },
    remaining: { static: 10, dynamic: 3 },
    subscription: null,
  });
