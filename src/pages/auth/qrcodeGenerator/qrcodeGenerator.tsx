import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Download, List } from "lucide-react";

import {
  Input,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Button,
  Textarea,
  QrCodeGenerated,
  Spinner,
} from "@/components";
import { QrTypeBadge } from "@/components/cardQrcode";
import { QrTypeSelector } from "@/components/createQrcode";
import { QrPreviewPanel } from "@/components/previewQRCode";
import { QrColorsSection } from "@/components/qrColors";
import { useCreateQrcode, useGetMeplan, useLang } from "@/hooks";
import { getImageUrl } from "@/config";
import { getTypeUsage, previewContent } from "@/utils";

function QrcodeGenerator() {
  const { data: myPlan, isLoading: isLoadingPlan, refetch: refetchPlan } = useGetMeplan();
  const canUseColors = myPlan?.plan.features.customColors === true;
  const { onSubmit, form, isLoading, data, colors, setColors, colorsValid } = useCreateQrcode({
    onSettled: refetchPlan,
    canUseColors,
  });
  const { translations } = useLang();
  const t = translations.components.CreateQrcode;
  const [isOpenDownload, setIsOpenDownload] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const selectedType = form.watch("type");
  const draftTitle = form.watch("title");
  const draftUrl = form.watch("url");
  const selectedAtLimit = getTypeUsage(myPlan, selectedType).atLimit;

  // O formulário limpa-se depois de criar: enquanto nada for escrito, o painel mostra o QR criado.
  const showResult = !!data && !draftTitle && !draftUrl;

  // Em ecrãs estreitos o painel fica por baixo do formulário: traz-o à vista quando o QR chega.
  useEffect(() => {
    if (data) previewRef.current?.scrollIntoView({ block: "nearest" });
  }, [data]);

  // Sem plano Pro/Premium o QR é sempre preto sobre branco, como o do servidor.
  const liveColors = canUseColors ? colors : { dark: "#000000", light: "#FFFFFF" };
  const { content: liveContent, sample: liveSample } = previewContent({
    type: selectedType,
    draft: draftUrl ?? "",
  });
  const liveHint = liveSample
    ? t.preview.liveSample
    : selectedType === "DYNAMIC"
      ? t.preview.liveDynamic
      : t.preview.liveStatic;

  const resultContent = data ? (data.targetUrl ?? data.staticContent ?? "") : "";

  return (
    <div className="mx-auto max-w-6xl">
      {data && (
        <QrCodeGenerated
          id={data.id}
          slug={data.slug}
          isOpen={isOpenDownload}
          setIsOpen={setIsOpenDownload}
          qrcode={getImageUrl(data.imageUrl ?? undefined)}
        />
      )}

      <header className="mb-8 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_23rem] xl:gap-12">
        <Form {...form}>
          <form
            noValidate
            className="w-full max-w-2xl space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <FormItem>
                  <span id="qr-type-label" className="text-sm leading-none font-medium select-none">
                    {t.select.fieldLabel}
                  </span>
                  <QrTypeSelector
                    labelledBy="qr-type-label"
                    value={field.value}
                    onChange={field.onChange}
                    myPlan={myPlan}
                    isLoading={isLoadingPlan}
                    invalid={!!fieldState.error}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.form.titleLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.form.titlePlaceholder}
                      type="text"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.form.urlLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.form.urlPlaceholder}
                      type="text"
                      inputMode="url"
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.form.tagsLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.form.tagsPlaceholder} type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.form.descriptionLabel}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.form.descriptionPlaceholder}
                        className="min-h-24 resize-y"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <QrColorsSection
              colors={colors}
              onChange={setColors}
              access={isLoadingPlan ? "loading" : canUseColors ? "enabled" : "locked"}
            />

            {/* Guardar fixo acima da barra inferior no telemóvel */}
            <div className="sticky bottom-[calc(var(--mobile-nav-h)+env(safe-area-inset-bottom))] z-(--z-header) -mx-4 flex flex-col gap-2 border-t bg-background px-4 py-3 md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
              {selectedAtLimit && (
                <p className="text-sm font-medium" role="status">
                  {translations.errors.PLAN_LIMIT_EXCEEDED}{" "}
                  <Link to="/subscriber" className="underline underline-offset-4">
                    {t.usage.upgrade}
                  </Link>
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto md:self-start"
                disabled={isLoading || selectedAtLimit || (canUseColors && !colorsValid)}>
                {isLoading && <Spinner />}
                {t.button.generate}
              </Button>
            </div>
          </form>
        </Form>

        <aside ref={previewRef} className="w-full max-w-sm xl:sticky xl:top-24 xl:max-w-none">
          <QrPreviewPanel
            emptyHint={t.preview.empty}
            live={{ content: liveContent, colors: liveColors, hint: liveHint, sample: liveSample }}
            image={showResult ? getImageUrl(data?.imageUrl ?? undefined) : null}
            title={showResult ? (data?.title ?? "") : draftTitle}
            link={showResult ? resultContent : draftUrl}
            badges={<QrTypeBadge type={showResult && data ? data.type : selectedType} />}
            actions={
              showResult ? (
                <>
                  <Button onClick={() => setIsOpenDownload(true)}>
                    <Download aria-hidden />
                    {t.preview.download}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/dashboard/my-qrcodes">
                      <List aria-hidden />
                      {t.preview.view}
                    </Link>
                  </Button>
                </>
              ) : undefined
            }
          />
        </aside>
      </div>
    </div>
  );
}

export { QrcodeGenerator };
