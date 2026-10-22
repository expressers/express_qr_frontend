import { createContext } from "react";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

export type ThemeProviderState = {
  /** The user's choice, including "system" */
  theme: Theme;
  /** What is actually on screen: never "system" */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

export const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);
