import { test, expect } from "@playwright/test";
import { defaultAuthedRoutes, fail, loginAs, meRoute, mockApi, ok } from "./fixtures/apiMock";

test.describe("change email", () => {
  test("sends the link to the new address and keeps the session", async ({ page }) => {
    await loginAs(page);
    let body: Record<string, unknown> | null = null;
    await mockApi(page, {
      ...defaultAuthedRoutes,
      "GET /api/account/me": meRoute(),
      "POST /api/account/change-email": (route) => {
        body = route.request().postDataJSON();
        return ok({ message: "ok" });
      },
    });

    await page.goto("/dashboard/settings");
    await page.getByRole("button", { name: "Alterar email" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Novo email").fill("novo@exemplo.com");
    await dialog.getByLabel("Senha actual").fill("Current-pass1!");
    await dialog.getByRole("button", { name: "Enviar link" }).click();

    await expect(dialog.getByText(/Enviámos um link para novo@exemplo\.com/)).toBeVisible();
    expect(body).toEqual({ newEmail: "novo@exemplo.com", currentPassword: "Current-pass1!" });
    expect(await page.evaluate(() => localStorage.getItem("auth_token"))).toBeTruthy();
  });

  test("a wrong current password is a field error, not a sign-out", async ({ page }) => {
    await loginAs(page);
    await mockApi(page, {
      ...defaultAuthedRoutes,
      "GET /api/account/me": meRoute(),
      "POST /api/account/change-email": () => fail("INVALID_CURRENT_PASSWORD", 400),
    });

    await page.goto("/dashboard/settings");
    await page.getByRole("button", { name: "Alterar email" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Novo email").fill("novo@exemplo.com");
    await dialog.getByLabel("Senha actual").fill("wrong");
    await dialog.getByRole("button", { name: "Enviar link" }).click();

    await expect(dialog.getByRole("alert")).toContainText("A senha actual está incorrecta");
    await expect(page).toHaveURL(/\/dashboard\/settings/);
    expect(await page.evaluate(() => localStorage.getItem("auth_token"))).toBeTruthy();
  });

  test("/confirm-email applies the token once and asks to sign in again", async ({ page }) => {
    let calls = 0;
    await mockApi(page, {
      "POST /api/account/confirm-email": (route) => {
        calls += 1;
        expect(route.request().postDataJSON()).toEqual({ token: "tok-123" });
        return ok({ email: "novo@exemplo.com" });
      },
    });

    await page.goto("/confirm-email?token=tok-123");
    await expect(page.getByRole("heading", { name: "Email alterado" })).toBeVisible();
    await expect(page.getByText("novo@exemplo.com")).toBeVisible();
    await expect(page.getByText(/a sessão terminou/i)).toBeVisible();
    expect(calls).toBe(1);

    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("/confirm-email shows the error for an invalid link", async ({ page }) => {
    await mockApi(page, { "POST /api/account/confirm-email": () => fail("INVALID_TOKEN", 400) });
    await page.goto("/confirm-email?token=bad");
    await expect(page.getByRole("heading", { name: "Não foi possível confirmar o email" })).toBeVisible();
    await expect(page.getByText("O link é inválido ou expirou")).toBeVisible();
  });
});

test.describe("session revocation", () => {
  test("a 401 UNAUTHORIZED lands on sign-in with the session-ended message", async ({ page }) => {
    await loginAs(page);
    await mockApi(page, {
      ...defaultAuthedRoutes,
      "GET /api/qrcodes": () => fail("UNAUTHORIZED", 401),
      "GET /api/account/me": () => fail("UNAUTHORIZED", 401),
    });

    await page.goto("/dashboard/my-qrcodes");
    await expect(page).toHaveURL(/\/auth\/signin\?reason=session-ended/);
    await expect(page.getByTestId("signin-notice")).toContainText("A sua sessão terminou, entre novamente");
    expect(await page.evaluate(() => localStorage.getItem("auth_token"))).toBeNull();
  });

  test("changing the password signs out and explains why", async ({ page }) => {
    await loginAs(page);
    await mockApi(page, {
      ...defaultAuthedRoutes,
      "GET /api/account/me": meRoute(),
      "POST /api/account/change-password": () => ok({ message: "ok" }),
    });

    await page.goto("/dashboard/profile/updatepassword");
    const passwords = page.locator("input[type=password]");
    await passwords.nth(0).fill("Old-password1!");
    await passwords.nth(1).fill("Brand-new-pass1!");
    await page.locator("button[type=submit]").click();

    await expect(page).toHaveURL(/\/auth\/signin\?reason=password-changed/);
    await expect(page.getByTestId("signin-notice")).toContainText("Senha alterada");
    expect(await page.evaluate(() => localStorage.getItem("auth_token"))).toBeNull();
  });
});
