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
import { Briefcase, Pencil, Timer, Wallet } from "lucide-react";
import { useGetMeplan, useLang } from "@/hooks";
import { formatCurrency, formattedDate } from "@/utils";

function Subscription() {
  const { data, isLoding } = useGetMeplan();
  const { translations } = useLang();
  const t = translations.pages.Subscription;

  const formatLimit = (limit: number | undefined) =>
    limit === -1 ? "∞" : limit;

  if (isLoding) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  const usageRows = [
    {
      type: t.type.static,
      usage: data?.usage?.static,
      max: data?.currentPlan?.maxQrCodes?.STATIC,
    },
    {
      type: t.type.Dynamic,
      usage: data?.usage?.dynamic,
      max: data?.currentPlan?.maxQrCodes?.DYNAMIC,
    },
    {
      type: t.type.total,
      usage: data?.usage?.total,
      max: data?.currentPlan?.maxQrCodes?.TOTAL,
    },
  ];

  return (
    <React.Fragment>
      <div className="pt-8 pb-16 space-y-6 w-full ">
        <div className="dark:bg-zinc-800/30 bg-sidebar p-6 rounded-xl space-y-12">
          <div className="flex items-center justify-between ">
            <h4 className="sm:text-xl text-sm font-bold">{t.title}</h4>

            <div>
              <Button variant="outline" className="p-6 rounded-3xl" asChild>
                <Link to="/subscriber" className="flex items-center">
                  <span>{t.planButton}</span>
                  <Pencil className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between sm:space-y-0 space-y-6 w-full">
            <div className="flex items-center gap-2 bg-zinc-400/10 px-4 py-4 rounded-lg">
              <span className="dark:bg-zinc-700/30 bg-zinc-500/10 p-2 rounded-full dark:text-green-800 text-green-500 ">
                <Briefcase className="lg:size-4 size-3" />
              </span>
              <div className="flex flex-col">
                <span className="lg:text-sm text-xs font-semibold ">
                  {t.plan[data?.currentPlan.name as keyof typeof t.plan] ??
                    data?.currentPlan.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg">
              <span className="dark:bg-zinc-700/30 bg-zinc-500/10 p-2 rounded-full dark:text-green-800 text-green-500">
                <Wallet className="lg:size-7 size-5" />
              </span>
              <div>
                <span className="text-xs font-semibold block">{t.price}</span>
                {data?.currentPlan.price && (
                  <span className="text-sm font-semibold block">
                    {formatCurrency(data?.currentPlan.price)}
                  </span>
                )}
              </div>
            </div>

            {data?.subscription && data?.subscription.currentPeriodEnd && (
              <div className="flex items-center gap-4">
                <span className="dark:bg-zinc-700/30 bg-zinc-500/10 p-2 rounded-full dark:text-green-800 text-green-500">
                  <Timer className="lg:size-7 size-5" />
                </span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{t.startDate}</span>
                    <span className="text-xs font-semibold">
                      {formattedDate(data?.subscription.currentPeriodStart)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{t.endDate}</span>
                    <span className="text-xs font-semibold">
                      {formattedDate(data?.subscription.currentPeriodEnd)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dark:bg-zinc-800/30 bg-sidebar py-6 px-5 rounded-xl ">
          <div className="w-full ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-6">{t.table.type}</TableHead>
                  <TableHead className=" text-center">
                    {t.table.inUse}
                  </TableHead>
                  <TableHead className=" text-center">
                    {t.table.limit}
                  </TableHead>
                  <TableHead className=" text-center">
                    {t.table.remaining}
                  </TableHead>
                  <TableHead className=" text-end">{t.table.usage} </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageRows.map((row) => (
                  <TableRow key={row.type}>
                    <TableCell className="font-medium py-6">
                      {row.type}
                    </TableCell>
                    <TableCell className=" text-center">
                      {row.usage?.current ?? 0}
                    </TableCell>
                    <TableCell className=" text-center text-green-600 text-lg ">
                      {formatLimit(row.max)}
                    </TableCell>
                    <TableCell className=" text-center text-red-600 text-lg">
                      {formatLimit(row.usage?.remaining ?? 0)}
                    </TableCell>
                    <TableCell className="text-end">
                      {row.usage?.limit === -1
                        ? "0%"
                        : `${row.usage?.percentage ?? 0}%`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-2">
                    {Object.values(data?.currentPlan?.maxQrCodes ?? {}).some(
                      (limit) => limit !== -1,
                    ) ? (
                      <span className="text-xs text-muted-foreground">
                        {t.footer.limited}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {t.footer.unlimited}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { Subscription };
