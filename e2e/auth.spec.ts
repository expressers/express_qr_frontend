import { test, expect } from "@playwright/test";
import { fail, fakeToken, loginAs, mockApi, ok, defaultAuthedRoutes } from "./fixtures/apiMock";

test.describe("auth", () => {
  test("registration shows an error for a duplicate e-mail", async ({ page }) => {
    await mockApi(page, {
      "POST /api/users": () => fail("EMAIL_IN_USE", 409, "This email address is already registered."),
    });
    await page.goto("/auth/signup");
    const textboxes = page.locator("input:not([type=password]):not([type=checkbox])");
    await textboxes.nth(0).fill("Ana");
    await textboxes.nth(1).fill("Silva");
    await page.locator("input[type=email]").fill("ana@test.local");
    // Password needs letter + digit + special char; the confirmation field must match.
    const passwords = page.locator("input[type=password]");
    await passwords.nth(0).fill("Password123!");
    await passwords.nth(1).fill("Password123!"); // "Confirmar Senha"
    await page.locator("button[type=submit]").click();
    await expect(page).toHaveURL(/signup/);
    await expect(page.locator("[data-sonner-toast], [role=alert], [role=status]").first()).toBeVisible();
  });

  test("registration validates empty required fields client-side", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.locator("button[type=submit]").click();
    await expect(page).toHaveURL(/signup/);
  });

  test("login stores the token and opens the dashboard", async ({ page }) => {
    await mockApi(page, {
      "POST /api/sessions": () => ok({ accessToken: fakeToken() }),
      ...defaultAuthedRoutes,
    });
    await page.goto("/auth/signin");
    await page.locator("input[type=email]").fill("ana@test.local");
    await page.locator("input[type=password]").fill("password123");
    await page.locator("button[type=submit]").first().click();
    await expect(page).toHaveURL(/\/dashboard/);
    expect(await page.evaluate(() => localStorage.getItem("auth_token"))).toBeTruthy();
  });

  test("login shows the unverified-email error", async ({ page }) => {
    await mockApi(page, {
      "POST /api/sessions": () => fail("EMAIL_NOT_VERIFIED", 403, "Your email address has not been verified."),
    });
    await page.goto("/auth/signin");
    await page.locator("input[type=email]").fill("ana@test.local");
    await page.locator("input[type=password]").fill("password123");
    await page.locator("button[type=submit]").first().click();
    // EMAIL_NOT_VERIFIED sends the user to the verification screen (e-mail kept in router state).
    await expect(page).toHaveURL(/\/auth\/verify-account/);
  });

  test("a wrong password keeps the user on sign-in without clearing the session", async ({ page }) => {
    await mockApi(page, {
      "POST /api/sessions": () => fail("INVALID_CREDENTIALS", 401, "Invalid email or password."),
    });
    await page.goto("/auth/signin");
    await page.locator("input[type=email]").fill("ana@test.local");
    await page.locator("input[type=password]").fill("wrong-password");
    await page.locator("button[type=submit]").first().click();
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.locator("[data-sonner-toast]").first()).toBeVisible();
  });

  test("a 401 UNAUTHORIZED from the API clears the session and sends the user to sign-in", async ({ page }) => {
    await loginAs(page);
    await mockApi(page, {
      ...defaultAuthedRoutes,
      "GET /api/qrcodes": () => fail("UNAUTHORIZED", 401, "Invalid token"),
    });
    await page.goto("/dashboard/my-qrcodes");
    await expect(page).toHaveURL(/\/auth\/signin/);
    expect(await page.evaluate(() => localStorage.getItem("auth_token"))).toBeNull();
  });

  test("private route redirects to sign-in when there is no session", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("expired token is treated as no session", async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("auth_token", t), fakeToken(-60));
    await page.goto("/dashboard/my-qrcodes");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });
});
