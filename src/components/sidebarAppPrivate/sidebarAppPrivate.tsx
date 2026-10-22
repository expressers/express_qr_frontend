import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../ui";
import { Link, useLocation } from "react-router-dom";
import {
  QrCode,
  Settings,
  LayoutDashboard,
  CreditCard,
  ChartColumnIncreasing,
} from "lucide-react";
import { useLang } from "@/hooks";
import { BrandMark } from "../brandMark/brandMark";
import { BRAND_NAME } from "../brandMark/brand";

function SidebarAppPrivate() {
  const location = useLocation();
  const { translations } = useLang();
  const { setOpenMobile } = useSidebar();
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
    <Sidebar collapsible="icon" variant="sidebar" className="fixed">
      <SidebarContent>
        <SidebarGroup className="h-full">
          <Link
            to="/"
            aria-label={BRAND_NAME}
            className="flex h-16 items-center px-2 md:h-[4.5rem]">
            <BrandMark variant="full" className="text-lg group-data-[collapsible=icon]:hidden" />
            <BrandMark variant="mark" className="hidden group-data-[collapsible=icon]:inline-flex" />
          </Link>
          <SidebarGroupContent className="h-full pt-4">
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                // Subpáginas (editar, gerar) mantêm o item pai marcado.
                const isActive =
                  item.url === "/dashboard"
                    ? location.pathname === item.url
                    : location.pathname.startsWith(item.url) ||
                      (item.url === "/dashboard/my-qrcodes" &&
                        /^\/dashboard\/qrcode-(edit|generator)/.test(location.pathname));

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="relative h-11 gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-[background-color,color,transform] duration-(--dur-fast) ease-(--ease-out) before:absolute before:inset-y-2.5 before:left-0 before:w-0.5 before:origin-center before:scale-y-0 before:rounded-full before:bg-foreground before:transition-transform before:duration-(--dur-base) before:ease-(--ease-out) hover:text-foreground active:scale-[.98] data-[active=true]:text-foreground data-[active=true]:before:scale-y-100 [&>svg]:size-[18px]">
                      <Link
                        to={item.url}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setOpenMobile(false)}>
                        <item.icon aria-hidden />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="absolute bottom-4 right-3 hidden md:block">
          <SidebarTrigger />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export { SidebarAppPrivate };
