import React from "react";
import { useTheme } from "@/hooks";
import { Button } from "../ui";
import { Moon, Sun } from "lucide-react";

/**
 * Flips the theme that is on screen. With "system" the raw value says nothing
 * about light/dark, so the provider's resolvedTheme is the source of truth.
 * Icons swap with rotation + 2px blur (160ms) so the crossfade reads as one object.
 */
function ToggleTheme() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <React.Fragment>
      <Button
        variant="outline"
        size="icon"
        className="relative size-11 md:size-10 rounded-full"
        aria-label="Toggle theme"
        onClick={() => setTheme(isDark ? "light" : "dark")}>
        <Sun
          className={`size-[1.15rem] transition-[transform,opacity,filter] duration-(--dur-fast) ease-(--ease-out) ${
            isDark ? "-rotate-90 scale-90 opacity-0 blur-[2px]" : "rotate-0 scale-100 opacity-100 blur-0"
          }`}
        />
        <Moon
          className={`absolute size-[1.15rem] transition-[transform,opacity,filter] duration-(--dur-fast) ease-(--ease-out) ${
            isDark ? "rotate-0 scale-100 opacity-100 blur-0" : "rotate-90 scale-90 opacity-0 blur-[2px]"
          }`}
        />
      </Button>
    </React.Fragment>
  );
}

export { ToggleTheme };
