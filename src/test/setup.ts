/// <reference types="bun" />
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterEach, expect } from "bun:test";

GlobalRegistrator.register({ url: "http://localhost:5173" });

const matchers = await import("@testing-library/jest-dom/matchers");
expect.extend(matchers as unknown as Parameters<typeof expect.extend>[0]);

const { cleanup } = await import("@testing-library/react");
afterEach(() => {
  cleanup();
  localStorage.clear();
});
