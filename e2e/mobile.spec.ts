import { test, expect } from "@playwright/test";
import { defaultAuthedRoutes, loginAs, mockApi } from "./fixtures/apiMock";

test.use({ viewport: { width: 375, height: 812 } });

test("landing has no horizontal scroll at 375px", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("generator form is usable and its controls are at least 44px tall", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox").first();
  await expect(input).toBeVisible();
  await input.fill("https://example.com");
  const button = page.getByRole("button", { name: /gerar|generate/i }).first();
  const box = await button.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
});

test("dashboard has no horizontal scroll and a mobile navigation trigger", async ({ page }) => {
  await loginAs(page);
  await mockApi(page, defaultAuthedRoutes);
  await page.goto("/dashboard");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await expect(page.getByRole("button", { name: /menu|sidebar|navega/i }).first()).toBeVisible();
});
