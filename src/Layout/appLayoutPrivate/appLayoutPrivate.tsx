import React from "react";
import { Outlet } from "react-router-dom";
import {
  MobileSidebar,
  SidebarProvider,
  SidebarAppPrivate,
  HeaderSidebar,
  LoadingPage,
} from "@/components";

function AppLayoutPrivate() {
  return (
    <React.Fragment>
      <div className="min-h-dvh relative">
          <SidebarProvider>
            <SidebarAppPrivate />
            <main className="flex-1  md:pt-24 pt-[4.5rem] md:px-8 px-4 pb-8 w-full">
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
