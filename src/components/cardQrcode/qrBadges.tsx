import type { QrType } from "@/service/api";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks";

const base =
  "inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium leading-none whitespace-nowrap";

/** Estático / Dinâmico: sempre neutro, distingue-se pelo texto e pela moldura. */
function QrTypeBadge({ type, className }: { type: QrType; className?: string }) {
  const { translations } = useLang();
  const t = translations.components.CardQrcode;
  return (
    <span className={cn(base, "border-border text-muted-foreground", className)}>
      {type === "DYNAMIC" ? t.typeDynamic : t.typeStatic}
    </span>
  );
}

/** Activo = moldura cheia e texto forte; inactivo = tracejado e texto atenuado. */
function QrStatusBadge({ isActive, className }: { isActive: boolean; className?: string }) {
  const { translations } = useLang();
  const t = translations.components.CardQrcode;
  return (
    <span
      className={cn(
        base,
        isActive
          ? "border-foreground text-foreground"
          : "border-dashed border-input text-muted-foreground",
        className,
      )}>
      {isActive ? t.active : t.inactive}
    </span>
  );
}

export { QrTypeBadge, QrStatusBadge };
