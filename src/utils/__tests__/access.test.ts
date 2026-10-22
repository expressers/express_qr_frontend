/// <reference types="bun" />
import { describe, expect, it } from "bun:test";
import { canManage } from "../access";

describe("canManage", () => {
  it("allows STAFF and ADMIN by role", () => {
    expect(canManage({ role: "STAFF" })).toBe(true);
    expect(canManage({ role: "ADMIN" })).toBe(true);
  });
  it("allows by the user:read:any permission", () => {
    expect(canManage({ role: "USER", permissions: ["user:read:any"] })).toBe(true);
  });
  it("denies a normal user, unknown and empty state", () => {
    expect(canManage({ role: "USER", permissions: ["qr:create"] })).toBe(false);
    expect(canManage({ role: null, permissions: null })).toBe(false);
    expect(canManage(null)).toBe(false);
  });
});
