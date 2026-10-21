import React from "react";

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
} from "@/components";
import { useLang, useUpdatePassword } from "@/hooks";


function UpdatePassword() {
  const { translations } = useLang()
  const { form, onSubmit, isLoading } = useUpdatePassword();
  const t = translations.pages.UpdatePassword;


  return (
    <React.Fragment>
      <div className="space-y-5">
        <h4 className="text-xl">Segurança</h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6 ">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t.fields.oldPassword.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.fields.oldPassword.placeholder}
                        type="password"
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
                name="newpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t.fields.newPassword.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.fields.newPassword.placeholder}
                        type="password"
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
                <Button className="p-6" disabled={isLoading} type="submit">
                  { isLoading && <Spinner />}
                  {t.button.submit}</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </React.Fragment>
  );
}

export { UpdatePassword };
