import React, { Activity} from "react";
import { Outlet } from "react-router-dom";
import {
  MobileSidebar,
  SidebarProvider,
  SidebarAppPrivate,
  HeaderSidebar,
  LoadingPage,
} from "@/components";
import { useLoadingPage} from "@/hooks";

function AppLayoutPrivate() {
  const { visibleLoadingPage } = useLoadingPage();

  return (
    <React.Fragment>
      <div className="h-screen relative">
        <LoadingPage />
        <Activity mode={visibleLoadingPage ? "hidden" : "visible"}>
          <SidebarProvider>
            <SidebarAppPrivate />
            <main className="flex-1  md:pt-20 pt-14  md:px-8 px-4  pb-8 w-full">
              <HeaderSidebar />
              <Outlet />
              <MobileSidebar />
            </main>
          </SidebarProvider>
        </Activity>
      </div>
    </React.Fragment>
  );
}

export { AppLayoutPrivate };
