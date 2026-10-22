import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CircleCheck, Lock, RotateCcw } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useLang } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  DEFAULT_QR_COLORS,
  contrastRatio,
  hasEnoughContrast,
  normalizeHex,
  relativeLuminance,
  sameColors,
  type QrColors,
} from "@/utils/contrast";

type ColorsAccess = "loading" | "locked" | "enabled";

interface HexFieldProps {
  id: string;
  label: string;
  pickerLabel: string;
  invalidText: string;
  value: string;
  disabled: boolean;
  onChange: (hex: string) => void;
}

/** Selector nativo + campo hexadecimal. Aceita escrita parcial e só confirma `#RRGGBB` válido. */
function HexField({
  id,
  label,
  pickerLabel,
  invalidText,
  value,
  disabled,
  onChange,
}: HexFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? value;
  const invalid = draft !== null && normalizeHex(draft) === null;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm leading-none font-medium select-none">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={pickerLabel}
          value={value.toLowerCase()}
          disabled={disabled}
          onChange={(event) => {
            setDraft(null);
            onChange(event.target.value.toUpperCase());
          }}
          className="size-11 shrink-0 cursor-pointer rounded-md border border-input bg-card p-1 disabled:cursor-not-allowed disabled:opacity-50 md:size-10 [&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
        />
        <Input
          id={id}
          value={text}
          disabled={disabled}
          maxLength={7}
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className="font-mono uppercase"
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            const hex = normalizeHex(next);
            // `#abc` ainda pode ser o princípio de `#abcdef`: só fixa a forma completa.
            if (hex && next.replace("#", "").length === 6) onChange(hex);
          }}
          onBlur={() => {
            const hex = draft === null ? null : normalizeHex(draft);
            if (hex) onChange(hex);
            setDraft(null);
          }}
        />
      </div>
      {invalid && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-sm font-medium text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {invalidText}
        </p>
      )}
    </div>
  );
}

interface QrColorsSectionProps {
  colors: QrColors;
  onChange: (colors: QrColors) => void;
  access: ColorsAccess;
  className?: string;
}

/**
 * Cores do QR (Pro/Premium): selector + hex para frente e fundo, com a razão
 * de contraste WCAG calculada em direto. Bloqueado no plano Free.
 */
function QrColorsSection({ colors, onChange, access, className }: QrColorsSectionProps) {
  const { translations, valueLang } = useLang();
  const t = translations.components.CreateQrcode.colors;
  const baseId = useId();
  const disabled = access !== "enabled";

  const ratio = contrastRatio(colors.dark, colors.light);
  const enough = hasEnoughContrast(colors);
  // Truncado (não arredondado): 4,499 nunca aparece como "4,50" e passa por engano.
  const ratioText = (Math.floor(ratio * 100) / 100).toLocaleString(
    valueLang === "pt" ? "pt-PT" : "en-GB",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );
  const inverted = relativeLuminance(colors.dark) > relativeLuminance(colors.light);
  const isDefault = sameColors(colors, DEFAULT_QR_COLORS);

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={`${baseId}-help`}
      className={cn("min-w-0 border-0 p-0", className)}
    >
      {/* A legenda real fica só para tecnologias de apoio: no ecrã o título faz parte da secção. */}
      <legend className="sr-only">{t.title}</legend>
      <div className="min-w-0 space-y-5 border-t pt-6">
        <div className="space-y-1">
          <h3 aria-hidden className="text-base font-semibold">
            {t.title}
          </h3>
          <p id={`${baseId}-help`} className="text-sm text-muted-foreground">
            {t.description}
          </p>
        </div>

        {access === "locked" && (
          <p
            className="flex items-start gap-2 rounded-lg border border-input bg-muted/50 px-3 py-2.5 text-sm"
            role="note"
          >
            <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              {t.locked} ·{" "}
              <Link
                to="/subscriber"
                className="rounded-sm font-medium underline underline-offset-4"
              >
                {t.upgrade}
              </Link>
            </span>
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <HexField
            id={`${baseId}-dark`}
            label={t.dark}
            pickerLabel={t.pickerLabel.replace("{name}", t.dark)}
            invalidText={t.hexInvalid}
            value={colors.dark}
            disabled={disabled}
            onChange={(dark) => onChange({ ...colors, dark })}
          />
          <HexField
            id={`${baseId}-light`}
            label={t.light}
            pickerLabel={t.pickerLabel.replace("{name}", t.light)}
            invalidText={t.hexInvalid}
            value={colors.light}
            disabled={disabled}
            onChange={(light) => onChange({ ...colors, light })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span
            aria-hidden
            className="flex h-9 w-14 items-center justify-center rounded-md border border-input text-base font-semibold"
            style={{ backgroundColor: colors.light, color: colors.dark }}
          >
            Aa
          </span>
          <p
            role="status"
            aria-live="polite"
            className={cn(
              "flex min-w-0 flex-1 items-start gap-1.5 text-sm",
              enough ? "text-muted-foreground" : "font-medium text-destructive",
            )}
          >
            {enough ? (
              <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
            ) : (
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            )}
            <span>
              <span className="sr-only">{t.contrast}: </span>
              {(enough ? t.ratioOk : t.ratioLow).replace("{ratio}", ratioText)}
            </span>
          </p>
          {!isDefault && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange({ ...DEFAULT_QR_COLORS })}
            >
              <RotateCcw aria-hidden />
              {t.reset}
            </Button>
          )}
        </div>
        {enough && inverted && !disabled && (
          <p className="text-sm text-muted-foreground">{t.inverted}</p>
        )}
      </div>
    </fieldset>
  );
}

export { QrColorsSection };
export type { ColorsAccess };
