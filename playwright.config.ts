import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke e2e against `vite preview` with the API intercepted via page.route
 * (see e2e/fixtures/apiMock.ts). No backend or database needed.
 * Not wired into `bun run build`; run with `bun run test:e2e`.
 */
export const API_URL = "http://api.test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  expect: { timeout: 10_000 },
  reporter: [["list"]],
  use: { baseURL: "http://localhost:4391", trace: "on-first-retry" },
  webServer: {
    command: `VITE_API_URL=${API_URL} bun --bun vite build --outDir .e2e-dist && bun --bun vite preview --outDir .e2e-dist --port 4391 --strictPort`,
    url: "http://localhost:4391",
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec\.ts/ },
  ],
});
