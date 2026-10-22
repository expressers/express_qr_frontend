import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useLang } from "@/hooks";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui";
import { BrandMark, BRAND_NAME } from "../brandMark";
import { NavHeader } from "../navHeader";
import { ToggleTheme } from "../toggleTheme";
import { ToggleLang } from "../toggleLang";
import { UserMenu } from "../userMenu";
import { useHeaderScrolled } from "./useHeaderScrolled";

type SiteHeaderVariant = "public" | "auth" | "app";

type SiteHeaderProps = {
  /**
   * public: marketing pages (nav, sign in / sign up, mobile menu)
   * auth: sign in / sign up / recovery screens (brand + toggles only)
   * app: signed-in pages without the sidebar shell (brand + toggles + user menu)
   */
  variant?: SiteHeaderVariant;
};

function SiteHeader({ variant = "public" }: SiteHeaderProps) {
  const { translations } = useLang();
  const t = translations.components.header;
  const navigate = useNavigate();
  const { sentinelRef, scrolled } = useHeaderScrolled();
  const token = useMemo(
    () =>
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,
    [],
  );

  const showNav = variant === "public";
  const showGuestActions = variant === "public" && !token;
  const showUserMenu = variant === "app" || (variant === "public" && !!token);

  return (
    <React.Fragment>
      {/* Scroll sentinel: leaves the viewport as soon as the page scrolls */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px w-full"
      />
      <header
        data-variant={variant}
        data-scrolled={scrolled}
        className="site-header-surface fixed inset-x-0 top-0 z-(--z-header)">
        <div className="flex h-16 w-full items-center justify-between gap-4 px-4 md:h-[4.5rem] md:px-8">
          <Link
            to="/"
            className="rounded-md text-lg md:text-xl">
            <BrandMark variant="full" size={22} />
          </Link>

          {showNav && (
            <div className="hidden md:block">
              <NavHeader />
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-3">
            {showGuestActions && (
              <div className="hidden gap-2 md:flex">
                <Button variant="outline" onClick={() => navigate("/auth/signin")}>
                  {t.buttons.signIn}
                </Button>
                <Button onClick={() => navigate("/auth/signup")}>
                  {t.buttons.createAccount}
                </Button>
              </div>
            )}
            <ToggleTheme />
            <ToggleLang />
            {showUserMenu && <UserMenu />}

            {showNav && (
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon-lg"
                      className="rounded-full"
                      aria-label={t.openMenu}>
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className="sr-only">{t.openMenu}</SheetTitle>
                      <SheetDescription className="sr-only">{BRAND_NAME}</SheetDescription>
                    </SheetHeader>
                    <NavHeader />
                    <SheetFooter>
                      {!token && (
                        <>
                          <SheetClose asChild>
                            <Button size="lg" onClick={() => navigate("/auth/signup")}>
                              {t.buttons.createAccount}
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button
                              size="lg"
                              variant="outline"
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
            )}
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}

export { SiteHeader };
export type { SiteHeaderVariant };
