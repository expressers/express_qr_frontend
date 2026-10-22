/// <reference types="bun" />
import { StrictMode } from "react";
import { afterEach, describe, expect, it, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// The page reaches apiClient, which requires an API URL outside Vite dev mode.
process.env.VITE_API_URL ||= "http://api.test";
const { LangProvider, UserProvider } = await import("@/context");
const { ConfirmEmail } = await import("./confirmEmail");

const realFetch = globalThis.fetch;
let calls: { url: string; body: string }[] = [];

function mockApi(status: number, body: unknown) {
  calls = [];
  globalThis.fetch = mock(async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), body: String(init?.body ?? "") });
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }) as unknown as typeof fetch;
}

function renderAt(search: string) {
  return render(
    <StrictMode>
      <LangProvider>
        <UserProvider>
          <MemoryRouter initialEntries={[`/confirm-email${search}`]}>
            <Routes>
              <Route path="/confirm-email" element={<ConfirmEmail />} />
            </Routes>
          </MemoryRouter>
        </UserProvider>
      </LangProvider>
    </StrictMode>,
  );
}

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("ConfirmEmail page", () => {
  it("confirms once (StrictMode-safe), shows the new email and asks to sign in again", async () => {
    localStorage.setItem("auth_token", "old");
    mockApi(200, { success: true, data: { email: "novo@exemplo.com" } });
    renderAt("?token=abc123");

    expect(await screen.findByText("Email alterado")).toBeTruthy();
    expect(screen.getByText(/novo@exemplo\.com/)).toBeTruthy();
    expect(screen.getByText(/a sessão terminou/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeTruthy();

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("http://api.test/api/account/confirm-email");
    expect(JSON.parse(calls[0].body)).toEqual({ token: "abc123" });
    // The session was revoked server-side: nothing is kept locally.
    expect(localStorage.getItem("auth_token")).toBeNull();
  });

  it("shows the translated error for an invalid or used token", async () => {
    mockApi(400, {
      success: false,
      error: { code: "INVALID_TOKEN", message: "x", status: 400, details: {} },
    });
    renderAt("?token=expired");

    expect(await screen.findByText("Não foi possível confirmar o email")).toBeTruthy();
    expect(screen.getByText("O link é inválido ou expirou. Peça um novo.")).toBeTruthy();
    expect(calls).toHaveLength(1);
  });

  it("shows the in-use error", async () => {
    mockApi(409, {
      success: false,
      error: { code: "EMAIL_IN_USE", message: "x", status: 409, details: {} },
    });
    renderAt("?token=dup");
    expect(await screen.findByText("Este email já está registado.")).toBeTruthy();
  });

  it("does not call the API without a token", async () => {
    mockApi(200, { success: true, data: { email: "x@y.z" } });
    renderAt("");
    expect(await screen.findByText("Não foi possível confirmar o email")).toBeTruthy();
    expect(screen.getByText(/não tem token/i)).toBeTruthy();
    expect(calls).toHaveLength(0);
  });
});
