import { test, expect } from "@playwright/test";
import { mockApi, ok } from "./fixtures/apiMock";

// Flow 1 (anon): generate a QR without login and download it. No authenticated calls allowed.
test("anonymous visitor generates a QR and downloads it", async ({ page }) => {
  // The landing page renders a WebGL shader; with software GL each action can take ~2s
  // and parallel workers slow it further, so give this flow a wider budget.
  test.setTimeout(90_000);
  const authedCalls: string[] = [];
  await mockApi(page, {
    "POST /api/qrcodes/public/static": () =>
      ok({
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>',
        dataUrl: "data:image/svg+xml;base64,PHN2Zy8+",
        format: "svg",
      }),
    "POST /api/qrcodes/public/download": (route) => {
      const { format } = route.request().postDataJSON() as { format: string };
      const types: Record<string, string> = { png: "image/png", svg: "image/svg+xml", pdf: "application/pdf" };
      return {
        status: 200,
        headers: {
          "access-control-allow-origin": "*",
          "content-type": types[format] ?? "application/octet-stream",
          "content-disposition": `attachment; filename="expressqr.${format}"`,
          "access-control-expose-headers": "content-disposition",
        },
        body: "<svg xmlns='http://www.w3.org/2000/svg'/>",
      };
    },
  });
  page.on("request", (r) => {
    if (r.headers()["authorization"]) authedCalls.push(r.url());
  });

  await page.goto("/");
  await page.getByRole("textbox").first().fill("https://example.com");
  await page.getByRole("button", { name: /gerar|generate/i }).first().click();

  await expect(page.locator("svg, img[src^='data:image']").first()).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /transferir png|download png/i }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("expressqr.png");
  expect(authedCalls).toEqual([]);
});
