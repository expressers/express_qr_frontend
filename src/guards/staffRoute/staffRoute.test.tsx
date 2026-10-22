/// <reference types="bun" />
import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// The module graph reaches apiClient, which requires an API URL outside Vite dev mode.
process.env.VITE_API_URL ||= "http://api.test";
const { StaffGate } = await import("./staffRoute");

const renderGate = (props: { user: { role: string | null; permissions: string[] | null }; settled: boolean }) =>
  render(
    <MemoryRouter initialEntries={["/dashboard/admin"]}>
      <Routes>
        <Route element={<StaffGate {...props} />}>
          <Route path="/dashboard/admin" element={<div>admin area</div>} />
        </Route>
        <Route path="/dashboard" element={<div>dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("StaffGate", () => {
  it("lets STAFF through", () => {
    renderGate({ user: { role: "STAFF", permissions: null }, settled: true });
    expect(screen.getByText("admin area")).toBeTruthy();
  });

  it("lets a user with the management permission through", () => {
    renderGate({ user: { role: "USER", permissions: ["user:read:any"] }, settled: true });
    expect(screen.getByText("admin area")).toBeTruthy();
  });

  it("redirects a regular USER to /dashboard", () => {
    renderGate({ user: { role: "USER", permissions: ["qr:create"] }, settled: true });
    expect(screen.getByText("dashboard")).toBeTruthy();
    expect(screen.queryByText("admin area")).toBeNull();
  });

  it("waits (no redirect, no content) while the role is still unknown", () => {
    renderGate({ user: { role: null, permissions: null }, settled: false });
    expect(screen.queryByText("dashboard")).toBeNull();
    expect(screen.queryByText("admin area")).toBeNull();
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("redirects once settled with no role information", () => {
    renderGate({ user: { role: null, permissions: null }, settled: true });
    expect(screen.getByText("dashboard")).toBeTruthy();
  });
});
