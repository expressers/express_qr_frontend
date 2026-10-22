import React from "react";
import { Outlet } from "react-router-dom";
import {
  MobileSidebar,
  SidebarProvider,
  SidebarAppPrivate,
  HeaderSidebar,
  LoadingPage,
} from "@/components";
import { useUserGetMe } from "@/hooks";

function AppLayoutPrivate() {
  // Mantém papel e permissões da conta actuais (menu Admin, guardas) em toda a área privada.
  useUserGetMe();

  return (
    <React.Fragment>
      <div className="min-h-dvh relative">
          <SidebarProvider>
            <SidebarAppPrivate />
            <main className="flex-1  md:pt-24 pt-[4.5rem] md:px-8 px-4 pb-[calc(var(--mobile-nav-h)+env(safe-area-inset-bottom)+2rem)] md:pb-8 w-full">
              <HeaderSidebar />
              <Outlet />
              <MobileSidebar />
            </main>
          </SidebarProvider>
        <LoadingPage />
      </div>
    </React.Fragment>
  );
}

export { AppLayoutPrivate };
