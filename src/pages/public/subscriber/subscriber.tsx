import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from "@/components";
import { useLang, usePlanManagement, useUserAccount } from "@/hooks";
import { authService, type Plan } from "@/service/api";
import { buildUpgradeMailto, getErrorMessage } from "@/utils";

/** Lista de características de um plano, derivada só dos dados da API. */
function planFeatures(plan: Plan, t: Record<string, string>): string[] {
  const { STATIC, DYNAMIC } = plan.maxQrCodes;
  const features = [
    STATIC === -1 ? t.unlimitedStatic : t.staticLimit.replace("{n}", String(STATIC)),
    DYNAMIC === -1 ? t.unlimitedDynamic : t.dynamicLimit.replace("{n}", String(DYNAMIC)),
    plan.features.analytics === "full" ? t.analyticsFull : t.analyticsBasic,
    t.windowDays.replace("{n}", String(plan.analyticsWindowDays)),
  ];
  if (plan.features.customColors) features.push(t.customColors);
  return features;
}

function Subscriber() {
  const { translations } = useLang();
  const t = translations.pages.Subscriber;
  const { data: plans, isLoading, error } = usePlanManagement();
  const { state } = useUserAccount();
  const isAuthenticated = authService.isAuthenticated();

  return (
    <React.Fragment>
      <div className="min-h-screen w-full">
        <div className="md:py-40 py-32 px-4 space-y-8 max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <h4 className="md:text-3xl text-2xl font-bold">{t.title}</h4>
            <p className="md:text-sm text-xs max-w-2xl mx-auto">{t.description}</p>
            <p className="text-xs max-w-2xl mx-auto border rounded-md px-4 py-3">
              {t.manualNotice}
            </p>
          </div>

          {isLoading ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-96 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-sm">
              {getErrorMessage(error, translations.errors, t.loadError)}
            </p>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 items-stretch">
              {plans.map((plan) => {
                const isFree = plan.name === "FREE";
                const upgradeHref = buildUpgradeMailto({
                  planName: plan.displayName,
                  accountEmail: state.user_email,
                  subject: t.mailSubject,
                  body: t.mailBody,
                });

                return (
                  <Card key={plan.name} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{plan.displayName}</CardTitle>
                      <CardDescription>{isFree ? t.free : t.priceOnRequest}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {isFree ? (
                        <Button className="p-6 w-full" variant="outline" asChild>
                          <Link to={isAuthenticated ? "/dashboard" : "/auth/signup"}>
                            {isAuthenticated ? t.goToDashboard : t.startFree}
                          </Link>
                        </Button>
                      ) : (
                        <Button className="p-6 w-full" asChild>
                          <a href={upgradeHref}>{t.cta}</a>
                        </Button>
                      )}
                      <Separator />
                    </CardContent>

                    <CardFooter>
                      <ul className="space-y-4">
                        {planFeatures(plan, t).map((feature) => (
                          <li key={feature} className="flex justify-start items-center gap-2">
                            <Check size={14} aria-hidden />
                            <span className="text-xs">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardFooter>
                  </Card>
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
