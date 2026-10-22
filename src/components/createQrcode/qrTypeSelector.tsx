import { useRef, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";

import { useLang } from "@/hooks";
import type { MyPlan, QrType } from "@/service/api";
import { formatLimit, getTypeUsage } from "@/utils";
import { cn } from "@/lib/utils";
import { useFormField } from "../ui";

interface QrTypeSelectorProps {
  value: QrType;
  onChange: (value: QrType) => void;
  myPlan: MyPlan | undefined;
  isLoading?: boolean;
  /** Id do rótulo visível do campo. Tem de ser usado dentro de um <FormField>. */
  labelledBy: string;
  invalid?: boolean;
}

/**
 * Seletor Estático / Dinâmico em segmentos. Um tipo no limite do plano fica
 * desactivado e mostra "Pedir upgrade".
 */
function QrTypeSelector({ value, onChange, myPlan, isLoading, labelledBy, invalid }: QrTypeSelectorProps) {
  const { translations } = useLang();
  const t = translations.components.CreateQrcode;
  const { formMessageId } = useFormField();
  const refs = useRef<Record<QrType, HTMLButtonElement | null>>({ STATIC: null, DYNAMIC: null });

  const options: { type: QrType; label: string; hint: string }[] = [
    { type: "STATIC", label: t.select.static, hint: t.select.staticHint },
    { type: "DYNAMIC", label: t.select.dynamic, hint: t.select.dynamicHint },
  ];

  // Um só ponto de foco no grupo: o escolhido, ou o primeiro disponível se o escolhido estiver no limite.
  const tabStop: QrType | undefined = !getTypeUsage(myPlan, value).atLimit
    ? value
    : options.find((o) => !getTypeUsage(myPlan, o.type).atLimit)?.type;

  function onKeyDown(event: KeyboardEvent, index: number) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const step = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    for (let i = 1; i <= options.length; i++) {
      const next = options[(index + step * i + options.length * 2) % options.length];
      if (!getTypeUsage(myPlan, next.type).atLimit) {
        onChange(next.type);
        refs.current[next.type]?.focus();
        return;
      }
    }
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={invalid ? formMessageId : undefined}
      aria-invalid={invalid || undefined}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option, index) => {
        const usage = getTypeUsage(myPlan, option.type);
        const selected = value === option.type;
        const unlimited = usage.limit === -1;
        return (
          <div key={option.type} className="flex flex-col gap-2">
            <button
              ref={(el) => {
                refs.current[option.type] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={usage.atLimit}
              tabIndex={tabStop === option.type ? 0 : -1}
              onClick={() => onChange(option.type)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "flex min-h-24 flex-1 flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-[border-color,box-shadow,transform,opacity] duration-(--dur-fast) ease-(--ease-out) active:scale-[.985]",
                selected
                  ? "border-foreground shadow-[inset_0_0_0_1px_var(--foreground)]"
                  : "border-input hover:border-foreground",
                usage.atLimit && "cursor-not-allowed border-dashed opacity-60 hover:border-input active:scale-100",
              )}>
              <span className="flex w-full items-baseline justify-between gap-3">
                <span className="text-sm font-semibold">{option.label}</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {isLoading
                    ? "…"
                    : unlimited
                      ? t.usage.unlimited
                      : t.usage.of
                          .replace("{used}", String(usage.used))
                          .replace("{limit}", formatLimit(usage.limit))}
                </span>
              </span>
              <span className="text-sm text-muted-foreground">{option.hint}</span>
            </button>
            {usage.atLimit && (
              <p className="text-sm font-medium">
                {t.usage.limitReached} ·{" "}
                <Link to="/subscriber" className="underline underline-offset-4">
                  {t.usage.upgrade}
                </Link>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { QrTypeSelector };
