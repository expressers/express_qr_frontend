import React from "react";
import {
  QrCode,
  Settings,
  LayoutDashboard,
  CreditCard,
  ChartColumnIncreasing,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useLang } from "@/hooks";
function MobileSidebar() {
  const location = useLocation();
  const isActivePage = (isActive: boolean) =>
    `flex items-center gap-3 text-sm transition-all duration-300 hover:bg-green-500/10 px-4 py-4 rounded-md ${
      isActive && "bg-green-500/10"
    }`;
  const { translations } = useLang();
  const t = translations.components.SidebarAppPrivate;

  const items = [
    { title: t.menu.dashboard, url: "/dashboard", icon: LayoutDashboard },
    { title: t.menu.myQrcodes, url: "/dashboard/my-qrcodes", icon: QrCode },
    {
      title: t.menu.subscription,
      url: "/dashboard/subscription",
      icon: CreditCard,
    },
    {
      title: t.menu.reports,
      url: "/dashboard/statistic",
      icon: ChartColumnIncreasing,
    },
    {
      title: t.menu.settings,
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <React.Fragment>
      <div className="fixed w-full bottom-0 left-0 right-0 px-4 py-2 dark:bg-zinc-800 bg-zinc-100 shadow-lg  md:hidden block">
        <div className="">
          <div>
            <ul className="flex items-center justify-center sm:gap-16 gap-6">
              {items.map((item, index) => {
                const isActive = item.url.startsWith("/dashboard/profile")
                  ? location.pathname.startsWith("/dashboard/profile")
                  : location.pathname === item.url;
                return (
                  <li key={index}>
                    <NavLink to={item.url} className={isActivePage(isActive)}>
                      <item.icon className="w-4 h-4" />
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { MobileSidebar };
