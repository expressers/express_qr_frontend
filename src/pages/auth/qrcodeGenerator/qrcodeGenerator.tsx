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
} from "@/components";

import { Link } from "react-router-dom";
import { PlanUsageCard } from "@/components/createQrcode";
import { useCreateQrcode, useGetMeplan, useLang, useModalDialog } from "@/hooks";
import { getImageUrl } from "@/config";
import { getTypeUsage } from "@/utils";

function QrcodeGenerator() {
  const { data: myPlan, isLoading: isLoadingPlan, refetch: refetchPlan } = useGetMeplan();
  const { onSubmit, form, isLoading, data } = useCreateQrcode({ onSettled: refetchPlan });
  const { translations } = useLang();
  const t = translations.components.CreateQrcode;
  const staticUsage = getTypeUsage(myPlan, "STATIC");
  const dynamicUsage = getTypeUsage(myPlan, "DYNAMIC");
  const selectedType = form.watch("type");
  const selectedAtLimit =
    selectedType === "STATIC" ? staticUsage.atLimit : dynamicUsage.atLimit;
  const { setIsVisibleDialogSaveImg, isVisibleDialogSaveImg } =
    useModalDialog();

  useEffect(() => {
    if (data) {
      setIsVisibleDialogSaveImg(true);
    }
  }, [data, setIsVisibleDialogSaveImg]);
  return (
    <React.Fragment>
      {data && (
        <QrCodeGenerated
          id={data.id}
          slug={data.slug}
          isOpen={isVisibleDialogSaveImg}
          setIsOpen={setIsVisibleDialogSaveImg}
          qrcode={getImageUrl(data.imageUrl ?? undefined)}
        />
      )}

      <div className="pt-8 pb-16 h-full">
        <div className="bg-sidebar h-full rounded-2xl ">
          <div className="lg:p-8   p-6 ">
            <div className=" space-y-6">
              <div>
                <h3 className="font-bold text-xl">{t.title}</h3>
              </div>
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <PlanUsageCard
                  myPlan={myPlan}
                  isLoading={isLoadingPlan}
                  type="STATIC"
                  title={t.select.static}
                />
                <PlanUsageCard
                  myPlan={myPlan}
                  isLoading={isLoadingPlan}
                  type="DYNAMIC"
                  title={t.select.dynamic}
                />
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
                            value={field.value}
                            onValueChange={field.onChange}>
                            <SelectTrigger className="w-full py-6">
                              <SelectValue placeholder={t.select.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel> {t.select.label}</SelectLabel>
                                <SelectItem
                                  value="STATIC"
                                  disabled={staticUsage.atLimit}>
                                  {t.select.static}
                                  {staticUsage.atLimit && ` · ${t.usage.limitReached}`}
                                </SelectItem>
                                <SelectItem
                                  value="DYNAMIC"
                                  disabled={dynamicUsage.atLimit}>
                                  {t.select.dynamic}
                                  {dynamicUsage.atLimit && ` · ${t.usage.limitReached}`}
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
                  <div className="flex flex-col items-end gap-2">
                    {selectedAtLimit && (
                      <p className="text-xs">
                        {translations.errors.PLAN_LIMIT_EXCEEDED}{" "}
                        <Link to="/subscriber" className="underline font-semibold">
                          {t.usage.upgrade}
                        </Link>
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="p-6"
                      disabled={isLoading || selectedAtLimit}>
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
