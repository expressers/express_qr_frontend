/// <reference types="bun" />
import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LangProvider } from "@/context";
import { Redirect } from "./redirect";

const realFetch = globalThis.fetch;

function renderAt(slug: string) {
  return render(
    <LangProvider>
      <MemoryRouter initialEntries={[`/r/${slug}`]}>
        <Routes>
          <Route path="/r/:slug" element={<Redirect />} />
        </Routes>
      </MemoryRouter>
    </LangProvider>,
  );
}

function mockTarget(targetUrl: unknown) {
  globalThis.fetch = mock(async () =>
    new Response(JSON.stringify({ targetUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  ) as unknown as typeof fetch;
}

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("Redirect page", () => {
  it("refuses a javascript: target and shows the not-found state", async () => {
    const replace = spyOn(window.location, "replace").mockImplementation(() => {});
    mockTarget("javascript:alert(document.domain)");
    renderAt("evil");
    expect(await screen.findByText("QR Code não encontrado")).toBeTruthy();
    expect(replace).not.toHaveBeenCalled();
    replace.mockRestore();
  });

  it("navigates to an https target with location.replace", async () => {
    const replace = spyOn(window.location, "replace").mockImplementation(() => {});
    mockTarget("https://example.org/landing");
    renderAt("good");
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(replace).toHaveBeenCalledWith("https://example.org/landing");
    replace.mockRestore();
  });
});
