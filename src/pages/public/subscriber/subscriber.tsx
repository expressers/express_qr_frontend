import React from "react";
import { Link } from "react-router-dom";
import { Check, Info, Minus } from "lucide-react";
import { Button, Skeleton } from "@/components";
import { useLang, usePlanManagement, useUserAccount } from "@/hooks";
import { authService, type Plan } from "@/service/api";
import { cn } from "@/lib/utils";
import { buildUpgradeMailto, getErrorMessage } from "@/utils";

type Feature = { label: string; included: boolean };

/** Lista de características de um plano, derivada só dos dados da API. */
function planFeatures(plan: Plan, t: Record<string, string>): Feature[] {
  const { STATIC, DYNAMIC } = plan.maxQrCodes;
  return [
    {
      label: STATIC === -1 ? t.unlimitedStatic : t.staticLimit.replace("{n}", String(STATIC)),
      included: true,
    },
    {
      label: DYNAMIC === -1 ? t.unlimitedDynamic : t.dynamicLimit.replace("{n}", String(DYNAMIC)),
      included: true,
    },
    {
      label: plan.features.analytics === "full" ? t.analyticsFull : t.analyticsBasic,
      included: true,
    },
    { label: t.windowDays.replace("{n}", String(plan.analyticsWindowDays)), included: true },
    { label: t.customColors, included: Boolean(plan.features.customColors) },
  ];
}

function Subscriber() {
  const { translations } = useLang();
  const t = translations.pages.Subscriber;
  const { data: plans, isLoading, error } = usePlanManagement();
  const { state } = useUserAccount();
  const isAuthenticated = authService.isAuthenticated();

  return (
    <React.Fragment>
      <div className="min-h-dvh w-full">
        <div className="mx-auto max-w-6xl space-y-10 px-4 pb-24 pt-28 md:pt-36">
          <header className="max-w-2xl space-y-3">
            <h1 className="text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-balance md:text-5xl">
              {t.title}
            </h1>
            <p className="text-base text-muted-foreground text-pretty">{t.description}</p>
          </header>

          <div
            role="note"
            className="flex max-w-3xl items-start gap-3 rounded-xl border border-input bg-card p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              <span className="font-semibold">{t.manualTitle}. </span>
              <span className="text-muted-foreground">{t.manualNotice}</span>
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[26rem] rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <p role="alert" className="text-sm">
              {getErrorMessage(error, translations.errors, t.loadError)}
            </p>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
              {plans.map((plan) => {
                const isFree = plan.name === "FREE";
                const recommended = plan.name === "PROFESSIONAL";
                const upgradeHref = buildUpgradeMailto({
                  planName: plan.displayName,
                  accountEmail: state.user_email,
                  subject: t.mailSubject,
                  body: t.mailBody,
                });

                return (
                  <section
                    key={plan.name}
                    aria-labelledby={`plan-${plan.name}`}
                    className={cn(
                      "flex flex-col gap-6 rounded-2xl border p-6",
                      recommended
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground",
                    )}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <h2 id={`plan-${plan.name}`} className="text-lg font-semibold">
                          {plan.displayName}
                        </h2>
                        {recommended && (
                          <span className="rounded-full border border-primary-foreground/40 px-2.5 py-0.5 text-xs font-medium">
                            {t.recommended}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-3xl font-semibold tracking-tight">
                        {isFree ? t.free : t.priceOnRequest}
                      </p>
                    </div>

                    {isFree ? (
                      <Button size="lg" variant="outline" className="w-full" asChild>
                        <Link to={isAuthenticated ? "/dashboard" : "/auth/signup"}>
                          {isAuthenticated ? t.goToDashboard : t.startFree}
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className={cn(
                          "w-full",
                          recommended &&
                            "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
                        )}
                        asChild>
                        <a href={upgradeHref}>{t.cta}</a>
                      </Button>
                    )}

                    <ul
                      className={cn(
                        "space-y-3 border-t pt-6 text-sm",
                        recommended ? "border-primary-foreground/20" : "border-border",
                      )}>
                      {planFeatures(plan, t).map((feature) => (
                        <li
                          key={feature.label}
                          className={cn(
                            "flex items-start gap-3",
                            !feature.included &&
                              (recommended ? "text-primary-foreground/60" : "text-muted-foreground"),
                          )}>
                          {feature.included ? (
                            <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                          ) : (
                            <Minus className="mt-0.5 size-4 shrink-0" aria-hidden />
                          )}
                          <span>
                            {feature.label}
                            {!feature.included && <span className="sr-only"> ({t.notIncluded})</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export { Subscriber };
