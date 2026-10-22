import React from "react";
import { NavLink } from "react-router-dom";

function NavHeader() {
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

  // Paleta P&B: o link activo é o texto principal sublinhado; os restantes ficam atenuados.
  const isLinkActive = ({ isActive }: { isActive: boolean }) =>
    `text-lg md:text-sm font-montserrat font-semibold transition-colors ${
      isActive
        ? "text-foreground underline underline-offset-8 decoration-2"
        : "text-muted-foreground hover:text-foreground"
    }`;
    
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
