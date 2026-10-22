import { test, expect } from "@playwright/test";

const isDark = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.classList.contains("dark"));

test.describe("theme", () => {
  test("respects prefers-color-scheme: dark on first visit", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect.poll(() => isDark(page)).toBe(true);
  });

  test("respects prefers-color-scheme: light on first visit", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect.poll(() => isDark(page)).toBe(false);
  });

  test("toggle flips the theme and the choice persists after reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const before = await isDark(page);
    await page.getByRole("button", { name: /theme|tema|dark|light|escuro|claro/i }).first().click();
    // Radix menus may need a second choice; pick the opposite option when a menu opens.
    const option = page.getByRole("menuitem", { name: before ? /light|claro/i : /dark|escuro/i });
    if (await option.count()) await option.first().click();
    await expect.poll(() => isDark(page)).toBe(!before);
    await page.reload();
    await expect.poll(() => isDark(page)).toBe(!before);
  });

  test("applies the stored theme before first paint (no wrong-theme flash)", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("vite-ui-theme", "dark"));
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
