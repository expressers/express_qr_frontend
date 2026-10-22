import { useState } from "react";
import { AlertCircle, QrCode } from "lucide-react";
import { useGenerateQr, useLang } from "@/hooks";
import { Button, Input, Spinner } from "../ui";
import { QrCodeResult } from "../qrCodeGenerated";

// Types shown in the segment; only "link" is available today (the rest are announced, disabled).
const SOON_TYPES = ["typeText", "typeWifi"] as const;

function FormGeneratorQrc() {
  const { isLoading, register, errors, handleSubmit, onSubmit, data } = useGenerateQr();
  const { translations } = useLang();
  const t = translations.components.FormGeneratorQrc;
  // Autofocus only where there is no on-screen keyboard to cover the page.
  const [autoFocus] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
  );

  const urlField = register("url");

  return (
    <section
      aria-label={t.title}
      className="grid w-full gap-6 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-card sm:p-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <div className="space-y-2">
          <span id="qr-type-label" className="block text-sm font-medium">
            {t.typesLabel}
          </span>
          <div
            role="group"
            aria-labelledby="qr-type-label"
            className="inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            <button
              type="button"
              aria-pressed="true"
              className="h-8 rounded-md bg-card px-3 text-sm font-medium shadow-card">
              {t.typeLink}
            </button>
            {SOON_TYPES.map((key) => (
              <button
                key={key}
                type="button"
                disabled
                title={t.soon}
                className="flex h-8 items-center gap-1.5 rounded-md px-3 text-sm text-subtle-foreground disabled:cursor-not-allowed">
                {t[key]}
                <span className="rounded-full border border-border px-1.5 text-[0.6875rem] leading-4">
                  {t.soon}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="qr-url" className="text-sm font-medium">
            {t.urlLabel}
          </label>
          <Input
            id="qr-url"
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            autoFocus={autoFocus}
            placeholder={t.placeholder}
            maxLength={2000}
            aria-invalid={Boolean(errors?.url)}
            aria-describedby={errors?.url ? "qr-url-error" : undefined}
            {...urlField}
            className="h-12 text-base md:h-12 md:text-base"
          />
          {errors?.url && (
            <p
              id="qr-url-error"
              role="alert"
              className="flex items-start gap-1.5 text-sm font-medium text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{errors.url.message}</span>
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full text-base sm:w-44"
          disabled={isLoading}
          aria-busy={isLoading}>
          {isLoading && <Spinner />}
          {t.button}
        </Button>
      </form>

      {/* Result slot: empty hint on desktop, mounted only after generating on small screens */}
      <div
        aria-live="polite"
        className={
          data
            ? "lg:border-l lg:border-border lg:pl-6"
            : "hidden lg:block lg:border-l lg:border-border lg:pl-6"
        }>
        {data ? (
          <QrCodeResult key={data.dataUrl + data.content} qrcode={data.dataUrl} content={data.content} />
        ) : (
          <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-input text-center">
            <QrCode className="size-8 text-subtle-foreground" aria-hidden="true" strokeWidth={1.25} />
            <p className="max-w-[11rem] text-sm text-subtle-foreground">{t.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export { FormGeneratorQrc };
