import React, {Activity} from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header, Header2, LoadingPage } from "@/components";
import { useLoadingPage } from "@/hooks";

function AppLayoutPublic() {
  const location = useLocation();
  const { visibleLoadingPage } = useLoadingPage();
 
  const pathNameSigns =
    location.pathname === "/auth/signup" ||
    location.pathname === "/auth/signin" ||
    location.pathname === "/auth/forgotpassword" ||
    location.pathname === "/auth/resetPassword" ||
    location.pathname === "/auth/verifyaccount";
 
  return (
    <React.Fragment>
      <section className="h-screen relative">
        {pathNameSigns ? <Header2 /> : <Header />}

        <LoadingPage />

        <Activity mode={visibleLoadingPage ? "hidden" : "visible"}>
          <main className="h-full">
            <Outlet />
          </main>
        </Activity>
      </section>
    </React.Fragment>
  );
}

export { AppLayoutPublic };
