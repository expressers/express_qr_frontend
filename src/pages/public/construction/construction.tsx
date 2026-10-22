import React from "react";
import { Link } from "react-router-dom";
import { BrandMark, Button } from "@/components";
import { useLang } from "@/hooks";

function Construction() {
  const { translations } = useLang();
  const t = translations.pages.System.construction;

  return (
    <React.Fragment>
      <main className="flex min-h-dvh flex-col bg-background px-6 py-8">
        <Link to="/" className="w-fit rounded-md">
          <BrandMark />
        </Link>
        <div className="flex flex-1 flex-col justify-center gap-6 pb-16">
          <div className="max-w-md space-y-2">
            <h1 className="text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-balance">
              {t.title}
            </h1>
            <p className="text-muted-foreground">{t.text}</p>
          </div>
          <Button size="lg" className="w-fit" asChild>
            <Link to="/">{t.action}</Link>
          </Button>
        </div>
      </main>
    </React.Fragment>
  );
}

export { Construction };
