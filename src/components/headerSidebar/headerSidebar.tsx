import React, { useEffect, useState } from "react";
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
import { userNameParts } from "@/utils";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeaderSidebar() {
  const { translations } = useLang();
  const t = translations.components.header;

  const [headerChangeBg, setHeaderChangeBg] = useState(false);
  const { setIsVisible } = useLoadingPage();
  const [hover, setHover] = useState(false);
  const { state, dispatch } = useUserAccount();
  const initials = userNameParts(state.user_name);
  const { open } = useSidebar();
  const navigate = useNavigate();

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

  function handleLogout() {
    dispatch({ type: "LOGOUT" });
    navigate("/auth/signin");
    setIsVisible(true)
  }

  return (
    <React.Fragment>
      <header
        className={`fixed top-0  right-0  transition-all duration-200 ease-in-out ${
          open
            ? " md:w-[calc(100%-16rem)] w-full "
            : " md:w-[calc(100%-3rem)] w-full"
        } z-1`}>
        <div
          className={`relative flex justify-between items-center p-4 md:px-8 md:py-5
          after:content-[''] after:absolute after:inset-0 after:backdrop-blur-md ${
            headerChangeBg
              ? "after:dark:bg-zinc-400/30"
              : "after:dark:bg-transparent"
          } after:-z-10`}>
          <div className="flex items-center gap-2">
          {/* No telemóvel a sidebar é um Sheet: este é o único gatilho visível. */}
          <SidebarTrigger className="md:hidden size-9" aria-label={t.openMenu} />
          <div className="bg-popover text-popover-foreground  relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border px-3 py-1 ">
            <span className="h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1">
              {" "}
              {t.free}
            </span>
          </div>
          </div>

          <div className="flex items-center gap-4">
            <Search />
            <ToggleTheme />
            <ToggleLang />

            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Avatar className="md:w-12 md:h-12 border-2 border-green-500 cursor-pointer">
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
                    <Avatar className="w-24 h-24 border-2 border-green-500 ">
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
                    className={`lg:p-6 md:p-6 p-2 cursor-pointer touch-none ${hover && "bg-accent text-red dark:bg-input/50"}`}
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
