import { test, expect } from "@playwright/test";
import { defaultAuthedRoutes, loginAs, meRoute, mockApi, ok } from "./fixtures/apiMock";

const users = [
  { id: "u-1", email: "ana@test.local", displayName: "Ana Silva", role: "USER", status: "ACTIVE", plan: "FREE" },
  {
    id: "u-2",
    email: "bruno@test.local",
    displayName: "Bruno Costa",
    role: "USER",
    status: "SUSPENDED",
    plan: "PRO",
    currentPeriodEnd: "2027-03-01T00:00:00.000Z",
  },
  { id: "u-3", email: "equipa@test.local", displayName: "Equipa", role: "STAFF", status: "ACTIVE", plan: "INTERNAL" },
];

const adminRoutes = (seen: { search: string[]; plan: unknown[]; status: unknown[] }) => ({
  ...defaultAuthedRoutes,
  "GET /api/admin/users": (_route: unknown, url: URL) => {
    const search = url.searchParams.get("search");
    if (search) seen.search.push(search);
    const list = search ? users.filter((u) => u.email.includes(search)) : users;
    return ok({ users: list, pagination: { page: 1, limit: 20, total: list.length, totalPages: 1 } });
  },
  "PATCH /api/admin/users/u-1/plan": (route: { request(): { postDataJSON(): unknown } }) => {
    seen.plan.push(route.request().postDataJSON());
    return ok({ plan: "PRO", currentPeriodEnd: "2027-01-20T00:00:00.000Z" });
  },
  "PATCH /api/admin/users/u-2/status": (route: { request(): { postDataJSON(): unknown } }) => {
    seen.status.push(route.request().postDataJSON());
    return ok({ userId: "u-2", newStatus: "ACTIVE" });
  },
  "GET /api/admin/audit-logs": () =>
    ok({
      logs: [
        {
          id: "a-1",
          createdAt: "2026-10-20T10:15:00.000Z",
          actorEmail: "admin@test.local",
          actorRole: "ADMIN",
          action: "USER_PLAN_CHANGED",
          targetType: "USER",
          targetId: "4b1f0e22-aaaa-bbbb-cccc-000000000001",
        },
      ],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    }),
});

test.describe("admin", () => {
  test("STAFF sees the menu entry, filters users, changes plan and status, reads the audit log", async ({ page }) => {
    await loginAs(page);
    const seen = { search: [] as string[], plan: [] as unknown[], status: [] as unknown[] };
    await mockApi(page, { ...adminRoutes(seen), "GET /api/account/me": meRoute("STAFF") });

    await page.goto("/dashboard");
    await expect(page.getByRole("link", { name: "Admin" }).first()).toBeVisible();
    await page.getByRole("link", { name: "Admin" }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/admin/);

    const table = page.getByRole("table");
    await expect(table.getByText("ana@test.local")).toBeVisible();
    await expect(table.getByText("bruno@test.local")).toBeVisible();
    await expect(table.getByText("Suspenso")).toBeVisible();

    // Search is sent to the API.
    await page.getByLabel("Pesquisar utilizadores").fill("ana");
    await expect.poll(() => seen.search).toContain("ana");
    await expect(table.getByText("bruno@test.local")).toHaveCount(0);

    // Change plan + duration.
    await page.getByRole("button", { name: "Acções para ana@test.local" }).click();
    await page.getByRole("menuitem", { name: "Alterar plano" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("radio", { name: "90 dias" }).click();
    await dialog.getByRole("button", { name: "Aplicar plano" }).click();
    await expect.poll(() => seen.plan).toEqual([{ plan: "PRO", periodDays: 90 }]);

    // Status change asks for confirmation first.
    await page.getByLabel("Pesquisar utilizadores").fill("");
    await expect(table.getByText("bruno@test.local")).toBeVisible();
    await page.getByRole("button", { name: "Acções para bruno@test.local" }).click();
    await page.getByRole("menuitem", { name: "Activo", exact: true }).click();
    expect(seen.status).toEqual([]);
    await page.getByRole("alertdialog").getByRole("button", { name: "Confirmar" }).click();
    await expect.poll(() => seen.status).toEqual([{ status: "ACTIVE" }]);

    // Audit tab.
    await page.getByRole("tab", { name: "Auditoria" }).click();
    await expect(page.getByRole("cell", { name: "USER_PLAN_CHANGED" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "admin@test.local" })).toBeVisible();
  });

  test("a regular USER has no Admin entry and /dashboard/admin redirects", async ({ page }) => {
    await loginAs(page);
    const seen = { search: [], plan: [], status: [] };
    await mockApi(page, { ...adminRoutes(seen), "GET /api/account/me": meRoute("USER") });

    await page.goto("/dashboard");
    await expect(page.getByRole("link", { name: "Painel" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Admin" })).toHaveCount(0);

    await page.goto("/dashboard/admin");
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
