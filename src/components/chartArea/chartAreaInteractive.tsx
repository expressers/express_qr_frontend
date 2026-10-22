import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useLang } from "@/hooks";
import type { DailyPoint } from "@/service/api";

interface ChartAreaInteractiveProps {
  /** Série diária vinda da API (`series` de /api/analytics/*). */
  series: DailyPoint[];
}

/** Datas da API são dias UTC (YYYY-MM-DD); formatar em UTC evita trocar o dia. */
function formatDay(value: string, locale: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ChartAreaInteractive({ series }: ChartAreaInteractiveProps) {
  const { translations, valueLang } = useLang();
  const t = translations.pages.Statistic;
  const locale = valueLang === "en" ? "en-GB" : "pt-PT";

  const chartConfig = {
    scans: { label: t.scans, color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <AreaChart data={series}>
        <defs>
          <linearGradient id="fillScans" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-scans)" stopOpacity={0.6} />
            <stop offset="95%" stopColor="var(--color-scans)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value: string) => formatDay(value, locale)}
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatDay(String(value), locale)}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="scans"
          type="monotone"
          fill="url(#fillScans)"
          stroke="var(--color-scans)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
