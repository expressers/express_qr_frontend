import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/components";
import { ChartAreaInteractive, formatDay } from "@/components/chartArea";
import {
  useGetMeplan,
  useLang,
  useMyStats,
  useQrCodeStats,
  useQrcodeOptions,
} from "@/hooks";
import type { AnalyticsBreakdown, DailyPoint, FieldCount } from "@/service/api";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils";

const ALL = "all";
const RANGE_OPTIONS = [7, 30, 90, 365];

type Tile = { label: string; value: number | undefined };

/** Números-chave: tipografia grande e tabular, separados por hairlines (sem cartões). */
function StatTiles({ tiles, loading }: { tiles: Tile[]; loading: boolean }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-flow-col lg:auto-cols-fr [&>div:last-child:nth-child(odd)]:col-span-2 lg:[&>div:last-child:nth-child(odd)]:col-span-1">
      {tiles.map((tile) => (
        <div key={tile.label} className="flex flex-col gap-1.5 bg-card p-4 sm:p-5">
          <dt className="text-sm text-muted-foreground">{tile.label}</dt>
          <dd className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
            {loading ? <Skeleton className="h-9 w-16" /> : (tile.value?.toLocaleString() ?? "-")}
          </dd>
        </div>
      ))}
    </dl>
  );
}

type BreakdownItem = FieldCount & { key?: string };

/** Lista ordenada com barra fina proporcional, sem pista de fundo. */
function BreakdownList({ title, items }: { title: string; items: BreakdownItem[] }) {
  const shown = items.slice(0, 8);
  const max = Math.max(...shown.map((item) => item.count), 1);
  return (
    <section aria-label={title} className="rounded-xl border bg-card p-4 sm:p-5">
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      <ul className="space-y-3">
        {shown.map((item, index) => (
          <li key={item.key ?? `${item.value}-${index}`} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="truncate" title={item.value}>
                {item.value}
              </span>
              <span className="font-mono font-medium tabular-nums">{item.count.toLocaleString()}</span>
            </div>
            <div
              aria-hidden
              className="h-1 rounded-full bg-chart-2"
              style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Seleção de período: segmento, só com o que a janela do plano permite. */
function RangeSegment({
  options,
  value,
  onChange,
  label,
  format,
}: {
  options: number[];
  value: number;
  onChange: (value: number) => void;
  label: string;
  format: (n: number) => string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-10 rounded-lg border border-input bg-card p-0.5">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={cn(
              "min-w-14 rounded-md px-3 text-sm font-medium tabular-nums transition-[background-color,color,transform] duration-(--dur-fast) ease-(--ease-out) active:scale-[.97]",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}>
            {format(option)}
          </button>
        );
      })}
    </div>
  );
}

/** Vista alternativa em tabela (acessibilidade: o gráfico não é a única forma de ler os dados). */
function SeriesTable({
  series,
  locale,
  dateLabel,
  scansLabel,
  summary,
}: {
  series: DailyPoint[];
  locale: string;
  dateLabel: string;
  scansLabel: string;
  summary: string;
}) {
  return (
    <details className="group border-t px-4 py-3 sm:px-5">
      <summary className="cursor-pointer select-none rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        {summary}
      </summary>
      <div className="mt-3 max-h-64 overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted text-left">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">{dateLabel}</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">{scansLabel}</th>
            </tr>
          </thead>
          <tbody>
            {[...series].reverse().map((point) => (
              <tr key={point.date} className="border-t">
                <td className="px-3 py-1.5">{formatDay(point.date, locale)}</td>
                <td className="px-3 py-1.5 text-right font-mono tabular-nums">{point.scans}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function Statistic() {
  const { translations, valueLang } = useLang();
  const t = translations.pages.Statistic;
  const locale = valueLang === "en" ? "en-GB" : "pt-PT";
  const [requestedDays, setRequestedDays] = useState(30);
  const [qrId, setQrId] = useState<string>(ALL);

  const { data: myPlan } = useGetMeplan();
  // Todos os QR, 100 a 100 (limite da API), com "carregar mais".
  const qrOptions = useQrcodeOptions();
  const chartAnimated = useRef(false);

  // O backend limita `days` à janela do plano; a UI só oferece o que o plano permite.
  const windowDays = myPlan?.plan.analyticsWindowDays;
  const rangeOptions = useMemo(() => {
    if (!windowDays) return RANGE_OPTIONS;
    const allowed = RANGE_OPTIONS.filter((option) => option <= windowDays);
    return allowed.length > 0 ? allowed : [windowDays];
  }, [windowDays]);
  const days = rangeOptions.includes(requestedDays)
    ? requestedDays
    : rangeOptions[rangeOptions.length - 1];

  const myStats = useMyStats(days);
  const qrStats = useQrCodeStats(qrId === ALL ? undefined : qrId, days);

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
  const format = (n: number) => t.daysShort.replace("{n}", String(n));
  const lastDaysLabel = t.lastDays.replace("{n}", String(active.data?.window?.days ?? days));

  const tiles: Tile[] = [
    { label: t.totalScans, value: totals?.totalScans },
    { label: t.scansInWindow, value: totals?.scansInWindow },
    { label: t.scansLast24h, value: totals?.scansLast24h },
    ...(isAll ? [{ label: t.totalQrCodes, value: myStats.data?.overview.totalQrCodes }] : []),
  ];

  const devices = breakdown?.byDevice ?? [];
  const referrers = (breakdown?.byReferrer ?? []).map((item) => ({
    ...item,
    value: item.value || t.direct,
  }));
  const topQr = isAll
    ? (myStats.data?.topQrCodes ?? []).map((qr) => ({
        key: qr.id,
        value: qr.title || qr.id,
        count: qr.scans,
      }))
    : [];
  const hasLists = devices.length > 0 || referrers.length > 0 || topQr.length > 0;
  const noScans = series.every((point) => point.scans === 0);

  return (
    <React.Fragment>
      <div className="space-y-6 pb-16 pt-6 sm:pt-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-[1.75rem] font-semibold leading-9 tracking-[-0.02em]">{t.title}</h1>
            {windowDays ? (
              <p className="text-sm text-muted-foreground">
                {t.windowLimit.replace("{n}", String(windowDays))}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex items-center gap-2">
              <Select value={qrId} onValueChange={setQrId}>
                <SelectTrigger className="w-full sm:w-[240px]" aria-label={t.selectQr}>
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
                  variant="ghost"
                  size="sm"
                  className="shrink-0 tabular-nums"
                  onClick={qrOptions.loadMore}
                  disabled={qrOptions.isLoading}>
                  {qrOptions.isLoading
                    ? t.loadingMore
                    : t.loadMore
                        .replace("{loaded}", String(qrOptions.items.length))
                        .replace("{total}", String(qrOptions.total))}
                </Button>
              )}
            </div>
            <div className="overflow-x-auto">
              <RangeSegment
                options={rangeOptions}
                value={days}
                onChange={setRequestedDays}
                label={t.range}
                format={format}
              />
            </div>
          </div>
        </div>

        {active.error ? (
          <p role="alert" className="rounded-xl border bg-card p-4 text-sm">
            {getErrorMessage(active.error, translations.errors, t.loadError)}
          </p>
        ) : (
          <>
            <StatTiles tiles={tiles} loading={active.isLoading} />

            <section className="overflow-hidden rounded-xl border bg-card" aria-labelledby="stat-series">
              <div className="flex items-baseline justify-between gap-4 p-4 pb-2 sm:p-5 sm:pb-2">
                <h2 id="stat-series" className="text-sm font-semibold">
                  {t.seriesTitle}
                </h2>
                <p className="text-sm text-muted-foreground">{lastDaysLabel}</p>
              </div>
              <div className="px-1 pb-3 sm:px-3">
                {active.isLoading ? (
                  <Skeleton className="mx-3 h-64 sm:h-80" />
                ) : noScans ? (
                  <p className="mx-auto max-w-sm py-16 text-center text-sm text-muted-foreground">
                    {t.noData}
                  </p>
                ) : (
                  <ChartAreaInteractive series={series} animatedRef={chartAnimated} />
                )}
              </div>
              {!active.isLoading && !noScans && (
                <SeriesTable
                  series={series}
                  locale={locale}
                  dateLabel={t.tableDate}
                  scansLabel={t.scans}
                  summary={t.tableView}
                />
              )}
            </section>

            {hasLists && (
              <div
                className={cn(
                  "grid grid-cols-1 gap-4",
                  [devices.length, referrers.length, topQr.length].filter(Boolean).length > 2
                    ? "md:grid-cols-3"
                    : "md:grid-cols-2",
                )}>
                {devices.length > 0 && <BreakdownList title={t.byDevice} items={devices} />}
                {referrers.length > 0 && <BreakdownList title={t.byReferrer} items={referrers} />}
                {topQr.length > 0 && <BreakdownList title={t.topQrCodes} items={topQr} />}
              </div>
            )}

            {!breakdown && !active.isLoading && (
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-input p-4 text-sm text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                <p className="max-w-prose">
                  {t.basicNotice}{" "}
                  <Link
                    to="/subscriber"
                    className="font-medium text-foreground underline underline-offset-4">
                    {translations.pages.Subscription.planButton}
                  </Link>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </React.Fragment>
  );
}

export { Statistic };
