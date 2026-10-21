import React from 'react'
import { useTheme } from "@/hooks";
import { Button } from '../ui';
import { Moon, Sun } from 'lucide-react';
function ToggleTheme() {
    const { setTheme, theme } = useTheme();
     const isTheme = theme === "light" ? "dark" : "light";
    
  return (
    <React.Fragment>
        <Button variant="outline" size="icon" className='md:p-6 p-4 ' onClick={() => setTheme(isTheme)}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
          <span className="sr-only">Toggle theme</span>
        </Button>
    </React.Fragment>
  );
}

export {ToggleTheme}