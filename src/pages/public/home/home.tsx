import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FormGeneratorQrc } from "@/components";
import { HomeBackdrop } from "@/components/homeBackground";
import { useLang, useLoadingPage } from "@/hooks";

function Home() {
  const { setIsVisible } = useLoadingPage();
  const { translations } = useLang();
  const t = translations.pages.Home;

  useEffect(() => {
    setIsVisible(true);
  }, [setIsVisible]);

  return (
    <React.Fragment>
      <div className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <HomeBackdrop />
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-8 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-28 sm:px-8 lg:pt-24">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-balance text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              {t.title}
            </h1>
            <p className="max-w-[34rem] text-pretty text-base text-muted-foreground sm:text-lg">
              {t.subtitle}
            </p>
          </div>

          <div className="w-full max-w-4xl space-y-4">
            <FormGeneratorQrc />
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>{t.accountNote}</span>
              <Link
                to="/auth/signup"
                className="inline-flex items-center gap-1 rounded-sm font-semibold text-foreground underline underline-offset-4">
                {t.accountCta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { Home };
