import { test, expect } from "@playwright/test";
import { defaultAuthedRoutes, fail, loginAs, mockApi, ok, plan } from "./fixtures/apiMock";

test("PLAN_LIMIT_EXCEEDED is surfaced in the UI without breaking the page", async ({ page }) => {
  await loginAs(page);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  let limitHit = false;
  await mockApi(page, {
    ...defaultAuthedRoutes,
    "POST /api/qrcodes": () => {
      limitHit = true;
      return fail("PLAN_LIMIT_EXCEEDED", 403, "Limit reached", {
        currentCount: 10,
        limit: 10,
        plan: "FREE",
        type: "STATIC",
      });
    },
    // After the rejected attempt the page refetches usage: the STATIC quota is now exhausted.
    "GET /api/plans/my-plan": () =>
      ok({
        plan: plan(),
        usage: { static: limitHit ? 10 : 9, dynamic: 1 },
        remaining: { static: limitHit ? 0 : 1, dynamic: 2 },
        subscription: null,
      }),
  });

  await page.goto("/dashboard/qrcode-generator");
  // Default type is STATIC; the title and the URL are both required by the form.
  await page.getByLabel(/^título|^title/i).fill("Promo");
  await page.getByLabel(/url de destino|destination url/i).fill("https://example.com");
  await page.locator("button[type=submit]").first().click();

  // Limit message (toast and inline) and the upgrade CTA, which is a link to /subscriber.
  await expect(page.getByText(/limite|limit/i).first()).toBeVisible();
  const upgrade = page.getByRole("link", { name: /upgrade|plano|subscri|pro/i }).first();
  await expect(upgrade).toBeVisible();
  await expect(upgrade).toHaveAttribute("href", /subscri/);
  expect(errors).toEqual([]);
});
