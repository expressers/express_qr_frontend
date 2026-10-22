import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components";
import { BRAND_NAME } from "@/components/brandMark/brand";
import { useLang, usePlanManagement } from "@/hooks";

/** Página "Sobre": o que o produto faz, estático vs dinâmico, planos e privacidade. */
function About() {
  const { translations } = useLang();
  const t = translations.pages.About;
  const { data: plans } = usePlanManagement();

  return (
    <React.Fragment>
      <div className="min-h-dvh w-full">
        <article className="mx-auto max-w-3xl space-y-12 px-4 pb-24 pt-28 md:pt-36">
          <header className="max-w-2xl space-y-4">
            <h1 className="text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-balance md:text-5xl">
              {t.title.replace("{brand}", BRAND_NAME)}
            </h1>
            <p className="text-base text-muted-foreground text-pretty md:text-lg">{t.intro.replace("{brand}", BRAND_NAME)}</p>
          </header>

          <section aria-labelledby="about-kinds" className="space-y-5 border-t pt-8">
            <h2 id="about-kinds" className="text-xl font-semibold tracking-[-0.01em]">
              {t.kinds.title}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 md:gap-10">
              <div className="space-y-1.5">
                <h3 className="font-medium">{t.kinds.static}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{t.kinds.staticBody}</p>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-medium">{t.kinds.dynamic}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{t.kinds.dynamicBody}</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="about-plans" className="space-y-4 border-t pt-8">
            <h2 id="about-plans" className="text-xl font-semibold tracking-[-0.01em]">
              {t.plans.title}
            </h2>
            <p className="max-w-prose text-sm text-muted-foreground text-pretty">{t.plans.body}</p>
            <Button variant="outline" asChild>
              <Link to="/subscriber">
                {t.plans.link}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </section>

          <section aria-labelledby="about-privacy" className="space-y-4 border-t pt-8">
            <h2 id="about-privacy" className="text-xl font-semibold tracking-[-0.01em]">
              {t.privacy.title}
            </h2>
            <p className="max-w-prose text-sm text-muted-foreground text-pretty">{t.privacy.body}</p>

            <div className="space-y-3 pt-2">
              <h3 className="font-medium">{t.privacy.retentionTitle}</h3>
              <p className="max-w-prose text-sm text-muted-foreground text-pretty">
                {t.privacy.retentionBody}
              </p>
              {plans.length > 0 ? (
                <dl className="grid max-w-md grid-cols-3 gap-4 pt-1">
                  {plans.map((plan) => (
                    <div key={plan.name} className="space-y-0.5">
                      <dt className="text-sm text-muted-foreground">{plan.displayName}</dt>
                      <dd className="text-sm font-medium tabular-nums">
                        {t.privacy.retentionDays.replace("{n}", String(plan.analyticsWindowDays))}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">{t.privacy.retentionUnknown}</p>
              )}
            </div>
          </section>

          <div className="border-t pt-8">
            <Button size="lg" asChild>
              <Link to="/auth/signup">{t.cta}</Link>
            </Button>
          </div>
        </article>
      </div>
    </React.Fragment>
  );
}

export { About };
