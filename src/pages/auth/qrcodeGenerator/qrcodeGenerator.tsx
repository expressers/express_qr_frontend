import React, { useEffect } from "react";

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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  QrCodeGenerated,
  Spinner,
  Toaster,
} from "@/components";

import { useCreateQrcode, useLang, useModalDialog } from "@/hooks";

function QrcodeGenerator() {
  const { onSubmit, form, isLoading, data } = useCreateQrcode();
  const { translations } = useLang();
  const t = translations.components.CreateQrcode;
  const { setIsVisibleDialogSaveImg, isVisibleDialogSaveImg } =
    useModalDialog();

  useEffect(() => {
    if (data) {
      setIsVisibleDialogSaveImg(true);
    }
  }, [data, setIsVisibleDialogSaveImg]);
  return (
    <React.Fragment>
      <Toaster richColors />
      {data?.imageUrl && (
        <QrCodeGenerated
          id={data.id}
          isOpen={isVisibleDialogSaveImg}
          setIsOpen={setIsVisibleDialogSaveImg}
          qrcode={data.imageUrl}
        />
      )}

      <div className="pt-8 pb-16 h-full">
        <div className="bg-sidebar h-full rounded-2xl ">
          <div className="lg:p-8   p-6 ">
            <div className=" space-y-6">
              <div>
                <h3 className="font-bold text-xl">{ t.title}</h3>
              </div>
              <Form {...form}>
                <form
                  action=""
                  className=" grid md:grid-cols-2 grid-cols-1   md:gap-5 gap-2.5 items-start"
                  onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                    <FormLabel className="text-xs ">{t.select.label}</FormLabel>
                    <Select defaultValue="link">
                      <SelectTrigger className="w-full py-6">
                        <SelectValue placeholder="Link" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t.select.label}</SelectLabel>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t.select.label}
                        </FormLabel>
                        <FormControl>
                          <Select
                            defaultValue="STATIC"
                            onValueChange={field.onChange}>
                            <SelectTrigger className="w-full py-6">
                              <SelectValue placeholder={t.select.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel> {t.select.label}</SelectLabel>
                                <SelectItem value="STATIC">
                                  {t.select.static}
                                </SelectItem>
                                <SelectItem value="DYNAMIC">
                                  {t.select.dynamic}
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t.form.titleLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.form.titlePlaceholder}
                            type="text"
                            className="py-6  text-xs"
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
                        <FormLabel className="text-xs">
                          {t.form.urlLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.form.urlPlaceholder}
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
                        <FormLabel className="text-xs">
                          {t.form.tagsLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.form.tagsPlaceholder}
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
                          {t.form.descriptionLabel}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t.form.descriptionPlaceholder}
                            className="py-6  text-xs"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:block hidden"></div>
                  <div className="flex justify-end">
                    <Button type="submit" className="p-6">
                      {isLoading && <Spinner />}
                      {t.button.generate}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { QrcodeGenerator };
