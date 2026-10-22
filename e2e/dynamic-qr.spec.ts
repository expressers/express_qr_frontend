import { test, expect } from "@playwright/test";
import { defaultAuthedRoutes, loginAs, mockApi, ok, qr, qrListResponse } from "./fixtures/apiMock";

test("authenticated user sees a dynamic QR in the list and the edit page loads its targetUrl", async ({ page }) => {
  await loginAs(page);
  const created = qr({ id: "qr-9", title: "Promo", slug: "promo9", targetUrl: "https://promo.test" });
  let patched: Record<string, unknown> | null = null;
  await mockApi(page, {
    ...defaultAuthedRoutes,
    "GET /api/qrcodes": (_route, url) => qrListResponse([created], url),
    "GET /api/qrcodes/qr-9": () => ok({ qrcode: created }),
    "PATCH /api/qrcodes/qr-9": (route) => {
      patched = route.request().postDataJSON();
      return ok({ ...created, ...patched });
    },
  });

  await page.goto("/dashboard/my-qrcodes");
  await expect(page.getByText("Promo").first()).toBeVisible();

  await page.goto("/dashboard/qrcode-edit/qr-9");
  const url = page.locator("input[value='https://promo.test']");
  await expect(url).toBeVisible();
  await url.fill("https://changed.test");
  await page.locator("button[type=submit]").first().click();
  await expect.poll(() => patched?.targetUrl).toBe("https://changed.test");
});

test("public redirect page resolves /r/:slug through the API (json=true)", async ({ page }) => {
  await mockApi(page, {
    // The SPA redirect page reads the bare `{ targetUrl }` JSON (api-contract: GET /r/:slug?json=true).
    "GET /r/promo9": () => ({
      status: 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({ targetUrl: "https://promo.test/landing" }),
    }),
  });
  await page.route("https://promo.test/**", (route) => route.fulfill({ status: 200, body: "landed" }));
  await page.goto("/r/promo9");
  await expect(page).toHaveURL(/promo\.test\/landing/);
});
