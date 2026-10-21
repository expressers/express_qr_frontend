import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useLang } from "@/hooks";
import { ToggleTheme } from "../toggleTheme";
import { ToggleLang } from "../toggleLang";
import { UserMenu } from "../userMenu";
import { NavHeader } from "../navHeader";

function Header() {
  const { translations } = useLang();
  const t = translations.components.header;
  const navigate = useNavigate();
  const location = useLocation();
  const isPageHome = location.pathname === "/";
  const token = useMemo(
    () =>
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,
    [],
  );

  const [headerChangeBg, setHeaderChangeBg] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHeaderChangeBg(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBgClass = headerChangeBg
    ? "after:backdrop-blur-md after:dark:bg-zinc-400/30"
    : "after:dark:bg-transparent";

  return (
    <React.Fragment>
      <header className="w-full fixed top-0 z-10 transition-all duration-200 ease-in-out">
        <div
          className={`relative top-0 w-full p-4 md:px-8 md:py-5 after:content-[''] after:absolute after:inset-0 after:-z-10 ${headerBgClass}`}>
          <div className="flex justify-between items-center w-full">
            <Link to="/">
              <span className={`md:text-2xl text-lg font-semibold  ${isPageHome && "text-white"}`}>
                BISC8R
              </span>
            </Link>
            <div className="hidden md:block">
              <NavHeader />
            </div>
            <div className="flex items-center justify-center gap-x-3 md:gap-x-6">
              {!token && (
                <div className="hidden md:flex gap-3">
                  <Button
                    variant="default"
                    className="p-6 rounded-sm"
                    onClick={() => navigate("/auth/signup")}>
                    {t.buttons.createAccount}
                  </Button>
                  <Button
                    variant="outline"
                    className="p-6 rounded-sm"
                    onClick={() => navigate("/auth/signin")}>
                    {t.buttons.signIn}
                  </Button>
                </div>
              )}
              <ToggleTheme />
              <ToggleLang />
              {token && <UserMenu />}

              <div className="md:hidden block">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" aria-label="Menu">
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader />
                    <NavHeader />
                    <SheetFooter>
                      {!token && (
                        <>
                          <SheetClose asChild>
                            <Button
                              variant="default"
                              className="p-6 rounded-sm"
                              onClick={() => navigate("/auth/signup")}>
                              {t.buttons.createAccount}
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button
                              variant="outline"
                              className="p-6 rounded-sm"
                              onClick={() => navigate("/auth/signin")}>
                              {t.buttons.signIn}
                            </Button>
                          </SheetClose>
                        </>
                      )}
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}

export { Header };
