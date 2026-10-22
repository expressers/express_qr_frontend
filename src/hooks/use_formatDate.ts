import { useLang } from "./use_Lang";

/** Formata datas ISO na língua activa; `null` se a data faltar ou for inválida. */
function useFormatDate() {
  const { valueLang } = useLang();
  const locale = valueLang === "pt" ? "pt-PT" : "en-GB";
  return (iso: string | null, withTime = false): string | null => {
    if (!iso) return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(withTime && { hour: "2-digit", minute: "2-digit" }),
    });
  };
}

export { useFormatDate };
