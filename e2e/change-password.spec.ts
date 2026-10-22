import { test, expect } from "@playwright/test";
import { defaultAuthedRoutes, fail, loginAs, mockApi } from "./fixtures/apiMock";

// Contract: a wrong current password is 400 INVALID_CURRENT_PASSWORD (never 401, which means "session invalid").
test("wrong current password shows an error and keeps the session", async ({ page }) => {
  await loginAs(page);
  await mockApi(page, {
    ...defaultAuthedRoutes,
    "POST /api/account/change-password": () =>
      fail("INVALID_CURRENT_PASSWORD", 400, "The current password you entered is incorrect"),
  });

  await page.goto("/dashboard/profile/updatepassword");
  const passwords = page.locator("input[type=password]");
  await passwords.nth(0).fill("Wrong-password1!");
  await passwords.nth(1).fill("Brand-new-pass1!");
  await page.locator("button[type=submit]").click();

  await expect(page.locator("[data-sonner-toast]").first()).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard\/profile\/updatepassword/);
  expect(await page.evaluate(() => localStorage.getItem("auth_token"))).toBeTruthy();
});
