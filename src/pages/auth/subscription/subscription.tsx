import React from "react";
import { Link } from "react-router-dom";
import { Info, Mail } from "lucide-react";
import { Button, Skeleton } from "@/components";
import { useGetMeplan, useLang, useUserAccount } from "@/hooks";
import { buildUpgradeMailto, formatLimit, formattedDate, getErrorMessage } from "@/utils";

function UsageRow({
  type,
  used,
  limit,
  remaining,
  labels,
}: {
  type: string;
  used: number;
  limit: number;
  remaining: number;
  labels: { inUse: string; remaining: string; unlimited: string; ofLimit: string };
}) {
  const unlimited = limit === -1;
  const pct = unlimited || limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const full = !unlimited && limit > 0 && used >= limit;
  return (
    <li className="space-y-3 py-5 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-semibold">{type}</h3>
        <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight">
          {used}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            {unlimited
              ? labels.unlimited
              : labels.ofLimit.replace("{limit}", formatLimit(limit, labels.unlimited))}
          </span>
        </p>
      </div>
      {!unlimited && (
        <div
          role="progressbar"
          aria-label={type}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-valuenow={used}
          className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={full ? "h-full bg-foreground" : "h-full bg-chart-2"}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        {labels.remaining}: <span className="font-mono tabular-nums">{formatLimit(remaining, labels.unlimited)}</span>
      </p>
    </li>
  );
}

function Subscription() {
  const { data, isLoading, error } = useGetMeplan();
  const { translations } = useLang();
  const { state } = useUserAccount();
  const t = translations.pages.Subscription;
  const tPlans = translations.pages.Subscriber;

  if (isLoading) {
    return (
      <div className="space-y-6 pt-6 sm:pt-8" aria-busy="true">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pt-8">
        <p role="alert" className="text-sm">
          {getErrorMessage(error, translations.errors, t.loadError)}
        </p>
      </div>
    );
  }

  const usageRows = [
    {
      type: t.type.static,
      used: data.usage.static,
      limit: data.plan.maxQrCodes.STATIC,
      remaining: data.remaining.static,
    },
    {
      type: t.type.Dynamic,
      used: data.usage.dynamic,
      limit: data.plan.maxQrCodes.DYNAMIC,
      remaining: data.remaining.dynamic,
    },
  ];

  const hasLimits = usageRows.some((row) => row.limit !== -1);
  const endDate = data.subscription?.currentPeriodEnd;
  const upgradeHref = buildUpgradeMailto({
    planName: data.plan.displayName,
    accountEmail: state.user_email,
    subject: tPlans.mailSubject,
    body: tPlans.mailBody,
  });

  return (
    <React.Fragment>
      <div className="w-full max-w-3xl space-y-8 pb-16 pt-6 sm:pt-8">
        <h1 className="text-[1.75rem] font-semibold leading-9 tracking-[-0.02em]">{t.title}</h1>

        <section
          aria-label={t.currentPlan}
          className="space-y-6 rounded-xl border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <dl className="flex flex-wrap gap-x-12 gap-y-4">
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">{t.currentPlan}</dt>
                <dd className="text-2xl font-semibold tracking-tight">{data.plan.displayName}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">{t.endDate}</dt>
                <dd className="text-2xl font-semibold tracking-tight tabular-nums">
                  {endDate ? formattedDate(endDate) : t.noEndDate}
                </dd>
              </div>
            </dl>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" size="lg" className="sm:h-10" asChild>
                <Link to="/subscriber">{t.planButton}</Link>
              </Button>
              <Button size="lg" className="sm:h-10" asChild>
                <a href={upgradeHref}>
                  <Mail aria-hidden />
                  {t.upgrade}
                </a>
              </Button>
            </div>
          </div>
          <p className="flex items-start gap-2.5 border-t pt-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            {tPlans.manualNotice}
          </p>
        </section>

        <section aria-labelledby="usage-title" className="rounded-xl border bg-card p-5 sm:p-6">
          <h2 id="usage-title" className="mb-5 text-sm font-semibold">
            {t.usageTitle}
          </h2>
          <ul className="divide-y">
            {usageRows.map((row) => (
              <UsageRow
                key={row.type}
                {...row}
                labels={{
                  inUse: t.table.inUse,
                  remaining: t.table.remaining,
                  unlimited: t.unlimited,
                  ofLimit: t.ofLimit,
                }}
              />
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted-foreground">
            {hasLimits ? t.footer.limited : t.footer.unlimited}
          </p>
        </section>
      </div>
    </React.Fragment>
  );
}

export { Subscription };
