import { test, expect } from "@playwright/test";
import { defaultAuthedRoutes, loginAs, meRoute, mockApi, myPlanRoute, ok, qr } from "./fixtures/apiMock";

test.describe("QR colours", () => {
  test("are disabled on Free with the upgrade message", async ({ page }) => {
    await loginAs(page);
    await mockApi(page, {
      ...defaultAuthedRoutes,
      "GET /api/account/me": meRoute(),
      "GET /api/plans/my-plan": myPlanRoute(false),
    });

    await page.goto("/dashboard/qrcode-generator");
    const section = page.getByRole("group", { name: "Cores" });
    await expect(section).toBeVisible();
    await expect(section.getByText("Disponível nos planos Pro e Premium")).toBeVisible();
    await expect(section.getByRole("link", { name: "Pedir upgrade" })).toHaveAttribute("href", "/subscriber");
    await expect(section.locator("input[type=color]").first()).toBeDisabled();
    await expect(section.getByLabel("Frente", { exact: true })).toBeDisabled();
  });

  test("on Pro: live contrast check blocks low contrast, preview is real, design is sent", async ({ page }) => {
    await loginAs(page);
    let created: Record<string, unknown> | null = null;
    await mockApi(page, {
      ...defaultAuthedRoutes,
      "GET /api/account/me": meRoute(),
      "GET /api/plans/my-plan": myPlanRoute(true),
      "POST /api/qrcodes": (route) => {
        created = route.request().postDataJSON();
        return ok(qr({ id: "qr-new", type: "STATIC", staticContent: "https://example.org", design: created?.design }), 201);
      },
    });

    await page.goto("/dashboard/qrcode-generator");
    const section = page.getByRole("group", { name: "Cores" });
    const front = section.getByLabel("Frente", { exact: true });
    await expect(front).toBeEnabled();

    // Real, client-rendered preview that follows what is typed.
    await page.getByLabel("Título").fill("Cartaz");
    await page.getByLabel("URL de destino").fill("https://example.org");
    const preview = page.getByRole("region", { name: "Pré-visualização" }).locator("img").first();
    await expect(preview).toHaveAttribute("src", /^data:image\/png/);
    const before = await preview.getAttribute("src");

    // Low contrast (#777777 on white = 4.48:1) is flagged and blocks saving.
    await front.fill("#777777");
    await expect(section.getByText(/Baixo demais/)).toBeVisible();
    const submit = page.getByRole("button", { name: "Gerar QR Code" });
    await expect(submit).toBeDisabled();

    // Enough contrast: ratio shown, preview redrawn with the new colour, save enabled.
    await front.fill("#112233");
    await expect(section.getByText(/Legível/)).toBeVisible();
    await expect(preview).not.toHaveAttribute("src", before ?? "");
    await expect(submit).toBeEnabled();
    await submit.click();

    await expect.poll(() => created?.design).toEqual({ dark: "#112233", light: "#FFFFFF" });
  });

  test("on Free the request never carries a design", async ({ page }) => {
    await loginAs(page);
    let created: Record<string, unknown> | null = null;
    await mockApi(page, {
      ...defaultAuthedRoutes,
      "GET /api/account/me": meRoute(),
      "GET /api/plans/my-plan": myPlanRoute(false),
      "POST /api/qrcodes": (route) => {
        created = route.request().postDataJSON();
        return ok(qr({ id: "qr-new", type: "STATIC", staticContent: "hello" }), 201);
      },
    });

    await page.goto("/dashboard/qrcode-generator");
    await page.getByLabel("Título").fill("Cartaz");
    await page.getByLabel("URL de destino").fill("hello");
    await page.getByRole("button", { name: "Gerar QR Code" }).click();
    await expect.poll(() => created).not.toBeNull();
    expect(created).not.toHaveProperty("design");
  });

  test("edit page: Pro changes the colours and sends the design", async ({ page }) => {
    await loginAs(page);
    const saved = qr({ id: "qr-5", type: "DYNAMIC", slug: "promo55", targetUrl: "https://promo.test", imageUrl: null });
    let patched: Record<string, unknown> | null = null;
    await mockApi(page, {
      ...defaultAuthedRoutes,
      "GET /api/account/me": meRoute(),
      "GET /api/plans/my-plan": myPlanRoute(true),
      "GET /api/qrcodes/qr-5": () => ok({ qrcode: saved }),
      "PATCH /api/qrcodes/qr-5": (route) => {
        patched = route.request().postDataJSON();
        return ok({ ...saved, ...patched });
      },
    });

    await page.goto("/dashboard/qrcode-edit/qr-5");
    const section = page.getByRole("group", { name: "Cores" });
    await section.getByLabel("Fundo", { exact: true }).fill("#F5F5F5");
    await page.getByRole("button", { name: "Guardar" }).click();
    await expect.poll(() => patched?.design).toEqual({ dark: "#000000", light: "#F5F5F5" });
  });
});
