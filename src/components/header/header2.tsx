import React from "react";

import { Link, useLocation } from "react-router-dom";

function Header2() {
  const location = useLocation();
  const pathNameSigin =
    location.pathname === "/auth/signin" ||
    location.pathname === "/auth/forgotpassword" ||
    location.pathname === "/auth/resetPassword" ||
    location.pathname === "/auth/verifyaccount";
  return (
    <React.Fragment>
      <header className="p-4 md:px-8 md:py-5 w-full fixed">
        <div
          className={`flex ${
            pathNameSigin ? "justify-start" : "justify-end"
          } items-center`}>
          <Link to="/" className="lg:visible md:visible invisible">
            <span className="md:text-2xl text-lg font-semibold ">BISC8R</span>
          </Link>
        </div>
      </header>
    </React.Fragment>
  );
}

export { Header2 };
