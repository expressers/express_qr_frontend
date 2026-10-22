import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartAreaInteractive,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/components";
import {
  useGetMeplan,
  useLang,
  useMyStats,
  useQrCodeStats,
  useQrcodeOptions,
} from "@/hooks";
import type { AnalyticsBreakdown, FieldCount } from "@/service/api";
import { getErrorMessage } from "@/utils";

const ALL = "all";
const RANGE_OPTIONS = [7, 30, 90, 365];

function StatCard({ label, value }: { label: string; value: number | undefined }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value ?? "—"}</CardTitle>
      </CardHeader>
    </Card>
  );
}

type BreakdownItem = FieldCount & { key?: string };

function BreakdownList({ title, items, emptyLabel }: { title: string; items: BreakdownItem[]; emptyLabel: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="space-y-2">
            {items.slice(0, 8).map((item, index) => (
              <li key={item.key ?? `${item.value}-${index}`} className="flex justify-between text-xs gap-4">
                <span className="truncate">{item.value}</span>
                <span className="font-semibold">{item.count}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function Statistic() {
  const { translations } = useLang();
  const t = translations.pages.Statistic;
  const [days, setDays] = useState(30);
  const [qrId, setQrId] = useState<string>(ALL);

  const { data: myPlan } = useGetMeplan();
  // Todos os QR, 100 a 100 (limite da API), com "carregar mais".
  const qrOptions = useQrcodeOptions();
  const myStats = useMyStats(days);
  const qrStats = useQrCodeStats(qrId === ALL ? undefined : qrId, days);

  // O backend limita `days` à janela do plano; a UI só oferece o que o plano permite.
  const windowDays = myPlan?.plan.analyticsWindowDays;
  const rangeOptions = useMemo(
    () => RANGE_OPTIONS.filter((option) => !windowDays || option <= windowDays),
    [windowDays],
  );

  const isAll = qrId === ALL;
  const active = isAll ? myStats : qrStats;
  const series = active.data?.series ?? [];
  const breakdown: AnalyticsBreakdown | undefined = active.data?.breakdown;
  const totals = isAll
    ? {
        totalScans: myStats.data?.overview.totalScans,
        scansInWindow: myStats.data?.overview.scansInWindow,
        scansLast24h: myStats.data?.overview.scansLast24h,
      }
    : qrStats.data?.stats;
  const lastDaysLabel = t.lastDays.replace("{n}", String(active.data?.window?.days ?? days));

  return (
    <React.Fragment>
      <div className="pt-8 pb-16 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-xl">{t.title}</h3>
          <div className="flex flex-wrap gap-2">
            <Select value={qrId} onValueChange={setQrId}>
              <SelectTrigger className="w-[220px]" aria-label={t.selectQr}>
                <SelectValue placeholder={t.selectQr} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{t.allQrCodes}</SelectItem>
                {qrOptions.items.map((qr) => (
                  <SelectItem key={qr.id} value={qr.id}>
                    {qr.title || qr.slug || qr.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {qrOptions.hasMore && (
              <Button
                variant="outline"
                onClick={qrOptions.loadMore}
                disabled={qrOptions.isLoading}>
                {t.loadMore
                  .replace("{loaded}", String(qrOptions.items.length))
                  .replace("{total}", String(qrOptions.total))}
              </Button>
            )}
            <Select value={String(days)} onValueChange={(value) => setDays(Number(value))}>
              <SelectTrigger className="w-[180px]" aria-label={t.range}>
                <SelectValue placeholder={t.range} />
              </SelectTrigger>
              <SelectContent>
                {rangeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {t.lastDays.replace("{n}", String(option))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {active.error ? (
          <p className="text-sm">{getErrorMessage(active.error, translations.errors, t.loadError)}</p>
        ) : (
          <>
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
              <StatCard label={t.totalScans} value={totals?.totalScans} />
              <StatCard label={t.scansInWindow} value={totals?.scansInWindow} />
              <StatCard label={t.scansLast24h} value={totals?.scansLast24h} />
              {isAll && (
                <StatCard label={t.totalQrCodes} value={myStats.data?.overview.totalQrCodes} />
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t.seriesTitle}</CardTitle>
                <CardDescription>{lastDaysLabel}</CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                {active.isLoading ? (
                  <Skeleton className="h-72 w-full" />
                ) : series.every((point) => point.scans === 0) ? (
                  <p className="text-sm text-muted-foreground py-12 text-center">{t.noData}</p>
                ) : (
                  <ChartAreaInteractive series={series} />
                )}
              </CardContent>
            </Card>

            {breakdown ? (
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                <BreakdownList title={t.byDevice} items={breakdown.byDevice} emptyLabel={t.noData} />
                <BreakdownList
                  title={t.byReferrer}
                  items={breakdown.byReferrer.map((item) => ({
                    ...item,
                    value: item.value || t.direct,
                  }))}
                  emptyLabel={t.noData}
                />
                {isAll && myStats.data?.topQrCodes && (
                  <BreakdownList
                    title={t.topQrCodes}
                    items={myStats.data.topQrCodes.map((qr) => ({
                      key: qr.id,
                      value: qr.title || qr.id,
                      count: qr.scans,
                    }))}
                    emptyLabel={t.noData}
                  />
                )}
              </div>
            ) : (
              !active.isLoading && <p className="text-xs text-muted-foreground">{t.basicNotice}</p>
            )}
          </>
        )}
      </div>
    </React.Fragment>
  );
}

export { Statistic };
