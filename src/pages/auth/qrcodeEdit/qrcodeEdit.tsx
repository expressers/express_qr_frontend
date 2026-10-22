import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Input,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Spinner,
  Textarea,
} from "@/components";
import { DeleteQrcodeDialog } from "@/components/cardQrcode";
import { useEditQrcode, useGetQrcode, useLang } from "@/hooks";
import type { QrCode } from "@/service/api";
import { getImageUrl } from "@/config";
import { getErrorMessage } from "@/utils";

function QrcodeEditForm({ qrcode }: { qrcode: QrCode }) {
  const navigate = useNavigate();
  const { translations } = useLang();
  const t = translations.pages.QrcodeEdit;
  const { form, onSubmit, isLoading, isDynamic } = useEditQrcode(qrcode);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div className="space-y-2">
          <span className="text-xs font-medium block">{t.type}</span>
          <span className="text-sm font-semibold block">
            {isDynamic ? t.dynamic : t.static}
          </span>
          <p className="text-xs text-muted-foreground">{t.typeHint}</p>
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="text-xs">{t.activeLabel}</FormLabel>
                <FormDescription className="text-xs">{t.activeHint}</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t.title}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t.titlePlaceholder}
                  type="text"
                  className="py-6 text-xs"
                  {...field}
                />
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
              <FormLabel className="text-xs">{isDynamic ? t.link : t.content}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t.linkPlaceholder}
                  type={isDynamic ? "url" : "text"}
                  className="py-6 text-xs"
                  {...field}
                />
              </FormControl>
              {isDynamic && (
                <FormDescription className="text-xs">{t.linkHint}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t.tags}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t.tagsPlaceholder}
                  type="text"
                  className="py-6 text-xs"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">{t.tagsHint}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">{t.description}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t.descriptionPlaceholder}
                  className="py-6 text-xs"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:block hidden"></div>
        <div className="flex items-center justify-end gap-4">
          <DeleteQrcodeDialog
            id={qrcode.id}
            title={qrcode.title || qrcode.id}
            onDeleted={() => navigate("/dashboard/my-qrcodes")}>
            <Button variant="outline" type="button" className="p-6 rounded-sm cursor-pointer">
              {t.delete}
            </Button>
          </DeleteQrcodeDialog>
          <Button
            variant="default"
            className="p-6 rounded-sm cursor-pointer"
            disabled={isLoading}
            type="submit">
            {isLoading && <Spinner />}
            {t.save}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function QrcodeEdit() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetQrcode(id);
  const { translations } = useLang();
  const t = translations.pages.QrcodeEdit;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="pt-8 pb-16 h-full">
        <div className="bg-sidebar h-full rounded-2xl">
          <div className="lg:p-8 p-6 space-y-6">
            <h3 className="font-bold text-xl">{t.editQrCode}</h3>

            {!data ? (
              <div className="space-y-4">
                <p className="text-sm">
                  {error
                    ? getErrorMessage(error, translations.errors, t.notFound)
                    : t.notFound}
                </p>
                <Link to="/dashboard/my-qrcodes" className="text-sm underline">
                  {t.back}
                </Link>
              </div>
            ) : (
              <>
                {data.imageUrl && (
                  <div className="w-28 rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(data.imageUrl)}
                      alt={data.title ?? ""}
                      className="w-full"
                    />
                  </div>
                )}
                <QrcodeEditForm qrcode={data} />
              </>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { QrcodeEdit };
