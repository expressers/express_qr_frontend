import { useId } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock, TriangleAlert, Trash2 } from "lucide-react";

import {
  Button,
  Input,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Skeleton,
  Spinner,
  Textarea,
} from "@/components";
import { DeleteQrcodeDialog, QrEmptyState, QrStatusBadge, QrTypeBadge } from "@/components/cardQrcode";
import { QrPreviewPanel } from "@/components/previewQRCode";
import { QrColorsSection } from "@/components/qrColors";
import { useEditQrcode, useGetMeplan, useGetQrcode, useLang } from "@/hooks";
import type { QrCode } from "@/service/api";
import { getImageUrl } from "@/config";
import { getErrorMessage, previewContent } from "@/utils";
import { cn } from "@/lib/utils";

/** Interruptor acessível (role="switch") para `isActive`. */
function ActiveSwitch({
  checked,
  onChange,
  id,
  labelId,
  descriptionId,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  id: string;
  labelId: string;
  descriptionId: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-[background-color,border-color,transform] duration-(--dur-base) ease-(--ease-out) active:scale-[.96]",
        checked ? "border-primary bg-primary" : "border-input bg-muted",
      )}>
      <span
        aria-hidden
        className={cn(
          "absolute left-0.5 size-5 rounded-full transition-transform duration-(--dur-base) ease-(--ease-out)",
          checked ? "translate-x-5 bg-primary-foreground" : "translate-x-0 bg-muted-foreground",
        )}
      />
    </button>
  );
}

function QrcodeEditForm({ qrcode }: { qrcode: QrCode }) {
  const navigate = useNavigate();
  const { translations } = useLang();
  const t = translations.pages.QrcodeEdit;
  const { data: myPlan, isLoading: isLoadingPlan } = useGetMeplan();
  const canUseColors = myPlan?.plan.features.customColors === true;
  const { form, onSubmit, isLoading, isDynamic, colors, setColors, colorsValid, colorsChanged } =
    useEditQrcode(qrcode, { canUseColors });
  const switchId = useId();

  const title = form.watch("title");
  const content = form.watch("content");
  const isActive = form.watch("isActive");

  // A imagem do servidor é a verdade. Só se desenha no cliente o que ainda não foi guardado:
  // cores alteradas, ou o texto de um QR estático (o dinâmico codifica o endereço curto).
  const liveNeeded = canUseColors && colorsChanged;
  const staticChanged = !isDynamic && content !== (qrcode.staticContent ?? "");
  const showLive = liveNeeded || staticChanged || !qrcode.imageUrl;
  const live = previewContent({
    type: qrcode.type,
    draft: content ?? "",
    slug: qrcode.slug,
  });
  const liveColors = canUseColors ? colors : (qrcode.design ?? { dark: "#000000", light: "#FFFFFF" });

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_23rem] xl:gap-12">
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-6">
          {/* Tipo: só leitura */}
          <div className="flex items-start gap-3 rounded-xl border bg-muted/50 p-4">
            <Lock size={16} aria-hidden className="mt-0.5 shrink-0 text-muted-foreground" />
            <div className="space-y-1">
              <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {t.type}
                <QrTypeBadge type={qrcode.type} />
              </p>
              <p className="text-sm text-muted-foreground">
                {t.typeHint} {!isDynamic && t.staticNote}
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start justify-between gap-4 rounded-xl border bg-card p-4">
                <div className="space-y-1">
                  <FormLabel id={`${switchId}-label`} htmlFor={`${switchId}-switch`}>
                    {t.activeLabel}
                  </FormLabel>
                  <FormDescription id={`${switchId}-hint`}>{t.activeHint}</FormDescription>
                </div>
                <ActiveSwitch
                  checked={field.value}
                  onChange={field.onChange}
                  id={`${switchId}-switch`}
                  labelId={`${switchId}-label`}
                  descriptionId={`${switchId}-hint`}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.title}</FormLabel>
                <FormControl>
                  <Input placeholder={t.titlePlaceholder} type="text" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isDynamic ? t.link : t.content}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.linkPlaceholder}
                    type={isDynamic ? "url" : "text"}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                {isDynamic && <FormDescription>{t.linkHint}</FormDescription>}
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
                  <FormLabel>{t.tags}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.tagsPlaceholder} type="text" {...field} />
                  </FormControl>
                  <FormDescription>{t.tagsHint}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.description}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t.descriptionPlaceholder}
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
          <div className="sticky bottom-[calc(var(--mobile-nav-h)+env(safe-area-inset-bottom))] z-(--z-header) -mx-4 flex items-center gap-3 border-t bg-background px-4 py-3 md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
            <Button
              type="submit"
              size="lg"
              className="flex-1 md:flex-none"
              disabled={isLoading || (canUseColors && !colorsValid)}>
              {isLoading && <Spinner />}
              {t.save}
            </Button>
            <Button type="button" variant="ghost" size="lg" asChild>
              <Link to="/dashboard/my-qrcodes">{t.cancel}</Link>
            </Button>
          </div>

          {/* Apagar: separado, nunca ao lado de Guardar */}
          <section
            aria-labelledby={`${switchId}-danger`}
            className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 id={`${switchId}-danger`} className="text-sm font-semibold">
                {t.dangerTitle}
              </h2>
              <p className="text-sm text-muted-foreground">{t.dangerBody}</p>
            </div>
            <DeleteQrcodeDialog
              id={qrcode.id}
              title={qrcode.title || qrcode.id}
              onDeleted={() => navigate("/dashboard/my-qrcodes")}>
              <Button type="button" variant="destructive" size="lg" className="shrink-0">
                <Trash2 aria-hidden />
                {t.delete}
              </Button>
            </DeleteQrcodeDialog>
          </section>
        </form>
      </Form>

      <aside className="w-full max-w-sm xl:sticky xl:top-24 xl:max-w-none">
        <QrPreviewPanel
          motion="swap"
          emptyHint=""
          image={!showLive && qrcode.imageUrl ? getImageUrl(qrcode.imageUrl) : null}
          live={{
            content: live.content,
            colors: liveColors,
            sample: live.sample,
            hint: translations.components.CreateQrcode.preview.liveStatic,
          }}
          title={title}
          link={content}
          badges={
            <>
              <QrTypeBadge type={qrcode.type} />
              <QrStatusBadge isActive={isActive} />
            </>
          }
        />
      </aside>
    </div>
  );
}

function QrcodeEditSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_23rem] xl:gap-12">
      <div className="space-y-6">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-11 rounded-md" />
        <Skeleton className="h-11 rounded-md" />
        <Skeleton className="h-11 w-40 rounded-md" />
      </div>
      <Skeleton className="aspect-[3/4] rounded-2xl" />
    </div>
  );
}

function QrcodeEdit() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetQrcode(id);
  const { translations } = useLang();
  const t = translations.pages.QrcodeEdit;

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/dashboard/my-qrcodes"
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-(--dur-fast) hover:text-foreground md:min-h-0">
        <ArrowLeft size={16} aria-hidden />
        {t.backShort}
      </Link>
      <header className="mb-8 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t.editQrCode}</h1>
      </header>

      {isLoading ? (
        <QrcodeEditSkeleton />
      ) : !data ? (
        <QrEmptyState
          role="alert"
          icon={TriangleAlert}
          title={error ? t.errorTitle : t.notFound}
          body={error ? getErrorMessage(error, translations.errors, t.notFound) : undefined}
          action={
            <Button variant="outline" asChild>
              <Link to="/dashboard/my-qrcodes">{t.back}</Link>
            </Button>
          }
        />
      ) : (
        <QrcodeEditForm qrcode={data} />
      )}
    </div>
  );
}

export { QrcodeEdit };
