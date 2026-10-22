/** Datas da API são dias UTC (YYYY-MM-DD); formatar em UTC evita trocar o dia. */
export function formatDay(value: string, locale: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
