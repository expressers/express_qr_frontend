import { useEditQrcode, useGetQrcodes, useLang } from "@/hooks";
import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Spinner,
  Select,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  Textarea,
} from "@/components";
import { useParams } from "react-router-dom";

import { getImageUrl } from "@/config";
import { Toaster } from "sonner";

function QrcodeEdit() {
  const { id } = useParams();
  const { data, isLoading: isLoadingQrcode } = useGetQrcodes();
  const { translations } = useLang();
  const t = translations.pages.QrcodeEdit;
  const [isReadOnly, setIsReadOnly] = useState(false);
  const itemQrcodeFilter = data?.find((item) => item.id === id);

  const { form, onSubmit, isLoading } = useEditQrcode({
    link: itemQrcodeFilter?.targetUrl ?? "",
    id: itemQrcodeFilter?.id ?? "",
    title: itemQrcodeFilter?.title ?? "",
    tags: Array.isArray(itemQrcodeFilter?.tags)
      ? itemQrcodeFilter.tags.join(", ")
      : (itemQrcodeFilter?.tags ?? ""),
    description: itemQrcodeFilter?.description ?? "",
  });

  useEffect(() => {
    if (itemQrcodeFilter) {
      setIsReadOnly(Boolean(itemQrcodeFilter.staticContent));
      form.reset({
        link: itemQrcodeFilter.targetUrl || itemQrcodeFilter.staticContent,
        title: itemQrcodeFilter.title,
        tags: Array.isArray(itemQrcodeFilter?.tags)
          ? itemQrcodeFilter.tags.join(", ")
          : (itemQrcodeFilter?.tags ?? ""),
        id: itemQrcodeFilter.id,
        description: itemQrcodeFilter.description ?? "",
      });
    }
  }, [itemQrcodeFilter, form]);

  if (isLoadingQrcode) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Toaster richColors />
      <div className="pt-8 pb-16 h-full">
        <div className="bg-sidebar h-full rounded-2xl ">
          <div className="lg:p-8 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl">{t.editQrCode}</h3>
              </div>
              
            </div>

            {itemQrcodeFilter?.imageUrl && (
              <div className="w-28 rounded-lg overflow-hidden">
                {
                  <img
                    src={getImageUrl(itemQrcodeFilter.imageUrl)}
                    alt={itemQrcodeFilter.title}
                    className="w-full"
                  />
                }
              </div>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {itemQrcodeFilter && (
                  <Select defaultValue={itemQrcodeFilter.type}>
                    <SelectTrigger className="w-full py-6">
                      <SelectValue placeholder={itemQrcodeFilter.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="STATIC">{t.static}</SelectItem>
                        <SelectItem value="DYNAMIC">{t.dynamic}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                {itemQrcodeFilter && (
                  <Select defaultValue={itemQrcodeFilter.status}>
                    <SelectTrigger className="w-full py-6">
                      <SelectValue placeholder={itemQrcodeFilter.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ACTIVE">{t.active}</SelectItem>
                        <SelectItem value="DESACTIVE">{t.inactive}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
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
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t.link}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.linkPlaceholder}
                          readOnly={isReadOnly}
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
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t.tags}</FormLabel>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-xs ">
                        {t.description}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t.descriptionPlaceholder}
                          className="py-6  text-xs"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:block hidden"></div>
                <div className="flex items-center justify-end gap-8">
                  <Button
                    variant="outline"
                    type="button"
                    className="p-6 rounded-sm cursor-pointer border 
                  border-red-400 bg-transparent dark:text-white text-black hover:bg-transparent">
                    Apagar
                  </Button>
                  <Button
                    variant="default"
                    className="p-6 rounded-sm cursor-pointer"
                    type="submit">
                    {isLoading && <Spinner />}
                    {t.save}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { QrcodeEdit };
