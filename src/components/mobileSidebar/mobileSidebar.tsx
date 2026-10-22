import {
  QrCode,
  Settings,
  LayoutDashboard,
  ChartColumnIncreasing,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCanManage, useLang } from "@/hooks";
import { cn } from "@/lib/utils";

/** Barra inferior do telemóvel: 4 destinos (5 para a equipa, com Admin), alvos de 48 px. O resto está no menu lateral. */
function MobileSidebar() {
  const location = useLocation();
  const { translations } = useLang();
  const t = translations.components.SidebarAppPrivate;
  const isStaff = useCanManage();

  const items = [
    { title: t.menu.dashboard, url: "/dashboard", icon: LayoutDashboard },
    { title: t.menuShort.myQrcodes, url: "/dashboard/my-qrcodes", icon: QrCode },
    {
      title: t.menu.reports,
      url: "/dashboard/statistic",
      icon: ChartColumnIncreasing,
    },
    {
      title: t.menuShort.settings,
      url: "/dashboard/settings",
      icon: Settings,
    },
    ...(isStaff
      ? [{ title: t.menuShort.admin, url: "/dashboard/admin", icon: ShieldCheck }]
      : []),
  ];

  return (
    <nav
      aria-label={t.brand}
      className="fixed inset-x-0 bottom-0 z-(--z-header) border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul
        className={cn(
          "mx-auto grid h-16 max-w-md",
          items.length > 4 ? "grid-cols-5" : "grid-cols-4",
        )}>
        {items.map((item) => {
          const isActive =
            item.url === "/dashboard"
              ? location.pathname === item.url
              : location.pathname.startsWith(item.url) ||
                (item.url === "/dashboard/my-qrcodes" &&
                  /^\/dashboard\/qrcode-(edit|generator)/.test(location.pathname));
          return (
            <li key={item.url}>
              <Link
                to={item.url}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-full min-h-12 flex-col items-center justify-center gap-1 px-1 text-xs transition-[color,transform] duration-(--dur-fast) ease-(--ease-out) active:scale-[.96]",
                  "after:absolute after:inset-x-6 after:top-0 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-foreground after:transition-transform after:duration-(--dur-base) after:ease-(--ease-out)",
                  isActive
                    ? "font-medium text-foreground after:scale-x-100"
                    : "text-muted-foreground",
                )}>
                <item.icon className="size-5" aria-hidden />
                <span className="max-w-full truncate">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { MobileSidebar };
