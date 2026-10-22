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
      <div className="space-y-6">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-[-0.01em]">{t.title}</h2>
          <p className="text-sm text-muted-foreground">{translations.pages.Settings.securityDesc}</p>
        </header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 items-start gap-x-6 gap-y-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fields.oldPassword.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.fields.oldPassword.placeholder}
                        type="password"
                        autoComplete="current-password"
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
                    <FormLabel>{t.fields.newPassword.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.fields.newPassword.placeholder}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button size="lg" className="w-full sm:h-10 sm:w-auto" disabled={isLoading} type="submit">
                {isLoading && <Spinner />}
                {t.button.submit}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </React.Fragment>
  );
}

export { UpdatePassword };
