import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  SidebarTrigger,
  useSidebar,
} from "@/components";

import { ToggleTheme } from "../toggleTheme";
import { Search } from "../search";
import { useLang, useLoadingPage, useUserAccount } from "@/hooks";

import { ToggleLang } from "../toggleLang";
import { BRAND_NAME } from "../brandMark/brand";
import { useHeaderScrolled } from "../header/useHeaderScrolled";
import { userNameParts } from "@/utils";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeaderSidebar() {
  const { translations } = useLang();
  const t = translations.components.header;

  const { sentinelRef, scrolled } = useHeaderScrolled();
  const { setIsVisible } = useLoadingPage();
  const [hover, setHover] = useState(false);
  const { state, dispatch } = useUserAccount();
  const initials = userNameParts(state.user_name);
  const { open } = useSidebar();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch({ type: "LOGOUT" });
    navigate("/auth/signin");
    setIsVisible(true)
  }

  return (
    <React.Fragment>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px w-full"
      />
      <header
        data-variant="app"
        data-scrolled={scrolled}
        className={`site-header-surface fixed top-0 right-0 z-(--z-header) transition-[width] duration-(--dur-slow) ease-(--ease-drawer) ${
          open
            ? "md:w-[calc(100%-16rem)] w-full"
            : "md:w-[calc(100%-3rem)] w-full"
        }`}>
        <div className="flex h-16 md:h-[4.5rem] items-center justify-between gap-3 px-4 md:px-8">
          <div className="flex items-center gap-2">
          {/* No telemóvel a sidebar é um Sheet: este é o único gatilho visível. */}
          <SidebarTrigger className="md:hidden size-11" aria-label={t.openMenu} />
          <span className="rounded-full border border-input px-3 py-1 text-sm font-medium text-muted-foreground">
            {t.free}
          </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Search />
            <ToggleTheme />
            <ToggleLang />

            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Avatar className="size-10 md:size-11 border border-input cursor-pointer">
                  <AvatarImage
                    src={state.user_photo ? state.user_photo : ""}
                    alt={state.user_name ? state.user_name : BRAND_NAME}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle></DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className=" h-full flex flex-col items-center justify-center gap-6">
                  <div className="space-y-4 flex flex-col justify-center items-center">
                    <Avatar className="w-24 h-24 border border-input">
                      <AvatarImage
                        src={state.user_photo ? state.user_photo : ""}
                        alt={state.user_name ? state.user_name : BRAND_NAME}
                      />
                      <AvatarFallback className="font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5">
                      <span className="text-sm text-center font-medium block capitalize">
                        {state.user_name ? state.user_name : BRAND_NAME}
                      </span>
                      <span className="text-sm text-center font-medium block ">
                        {state.user_email ? state.user_email : "qr@bic8.co"}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className={`lg:p-6 md:p-6 p-2 cursor-pointer touch-none ${hover && "bg-accent"}`}
                    onTouchStart={() => {
                      setHover(true);
                    }}
                    onTouchEnd={() => setHover(false)}
                    onClick={handleLogout}>
                    <span>Logout </span>
                    <LogOut />
                  </Button>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild></DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}

export { HeaderSidebar };
