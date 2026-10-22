import React from "react";
import { Outlet } from "react-router-dom";
import { LockKeyhole, User, Trash } from "lucide-react";

import { useLang } from "@/hooks";

function Profilelayaout() {
  const { translations } = useLang();

  const t = translations.layout.ProfileLayout;

  const itemMenuLink = [
    {
      title: t.menu.profile,
      icon: <User size={18} />,
      to: "#profile",
    },
    {
      title: t.menu.security,
      icon: <LockKeyhole size={18} />,
      to: "#security",
    },
    {
      title: t.menu.delete,
      icon: <Trash size={18} />,
      to: "#delete-account",
    },
  ];

  return (
    <React.Fragment>
      <div className="pt-8">
        <section className="grid md:grid-cols-4 grid-cols-1 gap-6 bg-card overflow-hidden rounded-2xl border border-border">
          <div className="md:col-span-1 md:h-auto h-20  sm:px-8 px-4 bg-sidebar py-4 md:py-8 overflow-x-scroll  [&::-webkit-scrollbar]:hidden">
            <ul className="flex md:flex-col flex-row gap-6">
              {itemMenuLink.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.to}
                    className={
                      "flex items-center gap-3 text-sm  px-4 py-3 rounded-md"
                    }>
                    <span>
                      <span>{item.icon}</span>
                    </span>
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <main className="md:col-span-3 sm:px-8 px-4 py-8">
            <Outlet />
          </main>
        </section>
      </div>
    </React.Fragment>
  );
}

export { Profilelayaout };
