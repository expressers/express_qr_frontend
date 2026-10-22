import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../ui";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  QrCode,
  Settings,
  LayoutDashboard,
  CreditCard,
  ChartColumnIncreasing,
} from "lucide-react";
import { useLang } from "@/hooks";

function SidebarAppPrivate() {
  const location = useLocation();
  const isActivePage = (isActive: boolean) =>
    `flex items-center transition-all duration-300 gap-3 text-sm px-4 py-6 rounded-md ${
      isActive ? "bg-foreground text-background font-medium" : "hover:bg-accent"
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
      <Sidebar collapsible="icon" variant="sidebar" className="fixed">
        <SidebarContent>
          <SidebarGroup className="h-full">
            <Link to="/">
              <SidebarGroupLabel className="py-9 text-2xl">
                {t.brand}
              </SidebarGroupLabel>
            </Link>
            <SidebarGroupContent className=" h-full py-8">
              <SidebarMenu className="space-y-2">
                {items.map((item, index) => {
                  const isActive = item.url.startsWith("/dashboard/profile")
                    ? location.pathname.startsWith("/dashboard/profile")
                    : location.pathname === item.url;

                  return (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        className={isActivePage(isActive)}>
                        <NavLink to={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="right-2 absolute bottom-7 z-40">
            <SidebarTrigger />
          </div>
        </SidebarContent>
      </Sidebar>
    </React.Fragment>
  );
}

export { SidebarAppPrivate };
