import React from "react";
import { NavLink, useLocation } from "react-router-dom";

function NavHeader() {
  const location = useLocation();
    const isPageHome = location.pathname === "/";
    
  const itemMenu = [
    {
      title: "Home",
      to: "/",
    },
    {
      title: "About",
      to: "/about",
    },
    {
      title: "Price",
      to: "/subscriber",
    },
  ];

  const isLinkActive = ({ isActive }: { isActive: boolean }) =>
    `text-lg md:text-sm  font-montserrat font-semibold ${
      isActive && "text-green-500"
    } ${isPageHome && !isActive && "md:text-white"}`;
    
  return (
    <React.Fragment>
      <nav className="flex md:flex-row flex-col md:p-0 p-4 items-center gap-8 md:gap-12  ">
        {itemMenu.map((item, index) => (
          <NavLink to={item.to} key={index} className={isLinkActive}>
            {item.title}
          </NavLink>
        ))}
      </nav>
    </React.Fragment>
  );
}

export { NavHeader };
