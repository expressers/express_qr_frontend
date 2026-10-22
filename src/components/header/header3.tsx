import { ToggleLang } from '../toggleLang';
import React, { useEffect, useState } from 'react'

import { UserMenu } from '../userMenu';
import { Link } from 'react-router-dom';
import { ToggleTheme } from '../toggleTheme';
import { BRAND_NAME } from '../brandMark/brand';

function Header3() {
    
    
  const [headerChangeBg, setHeaderChangeBg] = useState(false);
 
    
     useEffect(() => {
       const handleScroll = function () {
         if (window.scrollY > 0) {
           setHeaderChangeBg(true);
         } else {
           setHeaderChangeBg(false);
         }
       };
       window.addEventListener("scroll", handleScroll);

       return () => removeEventListener("scroll", handleScroll);
     }, []);
  
  return (
    <React.Fragment>
      <header
        className={`fixed top-0  right-0  transition-all duration-200 ease-in-out w-full z-1`}>
        <div
          className={`relative flex justify-between items-center p-4 md:px-8 md:py-5
          after:content-[''] after:absolute after:inset-0 after:backdrop-blur-md ${
            headerChangeBg
              ? "after:dark:bg-zinc-400/30"
              : "after:dark:bg-transparent"
          } after:-z-10`}>
          <div>
            {" "}
            <Link to="/">
              <span className="md:text-2xl text-lg font-semibold text-white">
                {BRAND_NAME}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ToggleTheme />

            <ToggleLang />
            <UserMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}

export {Header3}