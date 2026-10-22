import { test, expect } from "@playwright/test";
import { mockApi, ok, plan } from "./fixtures/apiMock";

test("/about is a real page (no redirect) with the honest summary", async ({ page }) => {
  await mockApi(page, {
    "GET /api/plans": () =>
      ok({
        plans: [
          { ...plan("FREE", "Free"), analyticsWindowDays: 30 },
          { ...plan("PRO", "Pro"), analyticsWindowDays: 90 },
          { ...plan("PREMIUM", "Premium"), analyticsWindowDays: 365 },
        ],
      }),
  });

  await page.goto("/about");
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sobre o ExpressQR");
  await expect(page.getByRole("heading", { name: "Estático ou dinâmico" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Privacidade" })).toBeVisible();
  await expect(page.getByText(/guardado truncado/)).toBeVisible();
  await expect(page.getByText("365 dias")).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver planos" })).toHaveAttribute("href", "/subscriber");
});

test("/about is available in English", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("lang", "en"));
  await mockApi(page, { "GET /api/plans": () => ok({ plans: [] }) });
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About ExpressQR");
  await expect(page.getByText("Each plan's period is on the plans page.")).toBeVisible();
});
