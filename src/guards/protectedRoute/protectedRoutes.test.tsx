/// <reference types="bun" />
import { describe, it, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "./protectedRoutes";

const jwtWithExp = (expSeconds: number) => {
  const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, "");
  return `${b64({ alg: "none" })}.${b64({ exp: expSeconds })}.sig`;
};

const renderGuard = () =>
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<div>private area</div>} />
        </Route>
        <Route path="/auth/signin" element={<div>signin page</div>} />
      </Routes>
    </MemoryRouter>,
  );

const inFuture = () => Math.floor(Date.now() / 1000) + 3600;
const inPast = () => Math.floor(Date.now() / 1000) - 3600;

describe("ProtectedRoutes", () => {
  it("redirects to /auth/signin when there is no token", () => {
    renderGuard();
    expect(screen.getByText("signin page")).toBeTruthy();
  });

  it("renders the child route for a token that has not expired", () => {
    localStorage.setItem("auth_token", jwtWithExp(inFuture()));
    renderGuard();
    expect(screen.getByText("private area")).toBeTruthy();
  });

  it("redirects when the token's exp claim is in the past", () => {
    localStorage.setItem("auth_token", jwtWithExp(inPast()));
    renderGuard();
    expect(screen.getByText("signin page")).toBeTruthy();
  });

  it("redirects when the token is not a decodable JWT", () => {
    localStorage.setItem("auth_token", "garbage");
    renderGuard();
    expect(screen.getByText("signin page")).toBeTruthy();
  });

  it("redirects when the token has no exp claim", () => {
    const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, "");
    localStorage.setItem("auth_token", `${b64({ alg: "none" })}.${b64({ sub: "1" })}.sig`);
    renderGuard();
    expect(screen.getByText("signin page")).toBeTruthy();
  });

  it("trusts auth_token_exp over the JWT exp when present (valid)", () => {
    localStorage.setItem("auth_token", jwtWithExp(inPast()));
    localStorage.setItem("auth_token_exp", String(Date.now() + 60_000));
    renderGuard();
    expect(screen.getByText("private area")).toBeTruthy();
  });

  it("redirects when auth_token_exp is in the past", () => {
    localStorage.setItem("auth_token", jwtWithExp(inFuture()));
    localStorage.setItem("auth_token_exp", String(Date.now() - 1));
    renderGuard();
    expect(screen.getByText("signin page")).toBeTruthy();
  });

  it("redirects when auth_token_exp is not a number", () => {
    localStorage.setItem("auth_token", jwtWithExp(inFuture()));
    localStorage.setItem("auth_token_exp", "abc");
    renderGuard();
    expect(screen.getByText("signin page")).toBeTruthy();
  });
});
