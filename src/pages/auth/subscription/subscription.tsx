import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Mail, Timer } from "lucide-react";
import { useGetMeplan, useLang, useUserAccount } from "@/hooks";
import { buildUpgradeMailto, formatLimit, formattedDate, getErrorMessage } from "@/utils";

function Subscription() {
  const { data, isLoading, error } = useGetMeplan();
  const { translations } = useLang();
  const { state } = useUserAccount();
  const t = translations.pages.Subscription;
  const tPlans = translations.pages.Subscriber;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pt-8">
        <p className="text-sm">{getErrorMessage(error, translations.errors, t.loadError)}</p>
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

  const percentage = (used: number, limit: number) =>
    limit === -1 || limit === 0 ? "—" : `${Math.min(100, Math.round((used / limit) * 100))}%`;

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
      <div className="pt-8 pb-16 space-y-6 w-full">
        <div className="dark:bg-zinc-800/30 bg-sidebar p-6 rounded-xl space-y-12">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h4 className="sm:text-xl text-sm font-bold">{t.title}</h4>

            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" className="p-6 rounded-3xl" asChild>
                <Link to="/subscriber">{t.planButton}</Link>
              </Button>
              <Button className="p-6 rounded-3xl" asChild>
                <a href={upgradeHref}>
                  <Mail className="size-4" aria-hidden />
                  {t.upgrade}
                </a>
              </Button>
            </div>
          </div>

          <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between sm:space-y-0 space-y-6 w-full">
            <div className="flex items-center gap-2 bg-zinc-400/10 px-4 py-4 rounded-lg">
              <span className="bg-zinc-500/10 p-2 rounded-full">
                <Briefcase className="lg:size-4 size-3" aria-hidden />
              </span>
              <span className="lg:text-sm text-xs font-semibold">{data.plan.displayName}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="bg-zinc-500/10 p-2 rounded-full">
                <Timer className="lg:size-7 size-5" aria-hidden />
              </span>
              <div className="space-y-1">
                <span className="text-xs block">{t.endDate}</span>
                <span className="text-sm font-semibold block">
                  {endDate ? formattedDate(endDate) : t.noEndDate}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{tPlans.manualNotice}</p>
        </div>

        <div className="dark:bg-zinc-800/30 bg-sidebar py-6 px-5 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-6">{t.table.type}</TableHead>
                <TableHead className="text-center">{t.table.inUse}</TableHead>
                <TableHead className="text-center">{t.table.limit}</TableHead>
                <TableHead className="text-center">{t.table.remaining}</TableHead>
                <TableHead className="text-end">{t.table.usage}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageRows.map((row) => (
                <TableRow key={row.type}>
                  <TableCell className="font-medium py-6">{row.type}</TableCell>
                  <TableCell className="text-center">{row.used}</TableCell>
                  <TableCell className="text-center text-lg">
                    {formatLimit(row.limit, t.unlimited)}
                  </TableCell>
                  <TableCell className="text-center text-lg">
                    {formatLimit(row.remaining, t.unlimited)}
                  </TableCell>
                  <TableCell className="text-end">{percentage(row.used, row.limit)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-2">
                  <span className="text-xs text-muted-foreground">
                    {hasLimits ? t.footer.limited : t.footer.unlimited}
                  </span>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </React.Fragment>
  );
}

export { Subscription };
