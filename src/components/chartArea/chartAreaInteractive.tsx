import { useState, type MutableRefObject } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useLang } from "@/hooks";
import type { DailyPoint } from "@/service/api";
import { formatDay } from "./formatDay";

interface ChartAreaInteractiveProps {
  /** Série diária vinda da API (`series` de /api/analytics/*). */
  series: DailyPoint[];
  /** Guardado pela página: o gráfico é remontado ao carregar outro período/QR e não deve voltar a animar. */
  animatedRef?: MutableRefObject<boolean>;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Série única, monocromática: traço sólido em `--chart-1` e preenchimento
 * quase transparente. Só desenha na primeira vez (600 ms, ease-out); mudar
 * de período ou de QR não volta a animar.
 */
export function ChartAreaInteractive({ series, animatedRef }: ChartAreaInteractiveProps) {
  const { translations, valueLang } = useLang();
  const t = translations.pages.Statistic;
  const locale = valueLang === "en" ? "en-GB" : "pt-PT";
  const [animate, setAnimate] = useState(() => !prefersReducedMotion() && !animatedRef?.current);

  const chartConfig = {
    scans: { label: t.scans, color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-64 w-full sm:h-80"
      role="img"
      aria-label={t.chartLabel}>
      <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillScans" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-scans)" stopOpacity={0.16} />
            <stop offset="100%" stopColor="var(--color-scans)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="2 4" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={40}
          tickFormatter={(value: string) => formatDay(value, locale)}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          width={36}
          tickMargin={4}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatDay(String(value), locale)}
              indicator="line"
            />
          }
        />
        <Area
          dataKey="scans"
          type="monotone"
          fill="url(#fillScans)"
          stroke="var(--color-scans)"
          strokeWidth={2}
          activeDot={{ r: 4, stroke: "var(--card)", strokeWidth: 2 }}
          isAnimationActive={animate}
          animationDuration={600}
          animationEasing="ease-out"
          onAnimationEnd={() => {
            if (animatedRef) animatedRef.current = true;
            setAnimate(false);
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
