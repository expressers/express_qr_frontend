import React from 'react'
import { useTheme } from "@/hooks";
import { Button } from '../ui';
import { Moon, Sun } from 'lucide-react';
function ToggleTheme() {
    const { setTheme, theme } = useTheme();

    // Flip the theme that is actually on screen: with "system" the raw value
    // says nothing about light/dark, so resolve it first.
    function toggle() {
      const isDark =
        theme === "system"
          ? document.documentElement.classList.contains("dark") ||
            window.matchMedia("(prefers-color-scheme: dark)").matches
          : theme === "dark";
      setTheme(isDark ? "light" : "dark");
    }

  return (
    <React.Fragment>
        <Button variant="outline" size="icon" className='md:p-6 p-4 ' onClick={toggle}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
          <span className="sr-only">Toggle theme</span>
        </Button>
    </React.Fragment>
  );
}

export {ToggleTheme}