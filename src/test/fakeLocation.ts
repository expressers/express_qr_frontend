/// <reference types="bun" />
/**
 * Replaces window.location with a recorder so tests can assert navigation
 * without happy-dom actually navigating. Call the returned `restore()` in afterEach.
 */
export function installFakeLocation(pathname = "/") {
  const original = Object.getOwnPropertyDescriptor(window, "location");
  const navigations: string[] = [];
  const fake = {
    pathname,
    search: "",
    hash: "",
    origin: "http://localhost:5173",
    get href() {
      return `http://localhost:5173${this.pathname}`;
    },
    set href(value: string) {
      navigations.push(String(value));
    },
    assign: (value: string) => void navigations.push(String(value)),
    replace: (value: string) => void navigations.push(String(value)),
    reload: () => {},
  };
  Object.defineProperty(window, "location", { configurable: true, value: fake });
  return {
    navigations,
    setPathname: (p: string) => {
      fake.pathname = p;
    },
    restore: () => {
      if (original) Object.defineProperty(window, "location", original);
    },
  };
}
