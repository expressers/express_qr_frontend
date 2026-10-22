import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteHeader, LoadingPage } from "@/components";

const AUTH_PATHS = new Set([
  "/auth/signup",
  "/auth/signin",
  "/auth/forgotpassword",
  "/auth/resetPassword",
  "/auth/verifyaccount",
]);

function AppLayoutPublic() {
  const location = useLocation();
  const isAuthScreen = AUTH_PATHS.has(location.pathname);

  return (
    <React.Fragment>
      <section className="relative min-h-dvh">
        <SiteHeader variant={isAuthScreen ? "auth" : "public"} />
        <main className="grid min-h-dvh grid-rows-[minmax(0,1fr)]">
          <Outlet />
        </main>
        {/* Overlay above the page: content is mounted underneath, never held back */}
        <LoadingPage />
      </section>
    </React.Fragment>
  );
}

export { AppLayoutPublic };
