import {
  Button,
  Input,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Toaster,
  Spinner,
} from "@/components";
import React from "react";

import {
  useLang,
  useMyProfile,
  useUpdatePassword,
  useUserAccount,
} from "@/hooks";
import { userNameParts } from "@/utils";

function Settings() {
  const { translations } = useLang();
  const { state } = useUserAccount();

  const {
    form: formUpdatePassword,
    onSubmit: onSubmitUpdatePassword,
    isLoading,
  } = useUpdatePassword();
  const tUpdatePassword = translations.pages.UpdatePassword;
  const t = translations.pages.MyProfile;
  const tProfileLayout = translations.layout.ProfileLayout;
  const initials = userNameParts(state.user_name);

  const getNameParts = (userName?: string | null) => {
    if (!userName) return { firstName: "", lastName: "" };

    if (userName.includes("@")) {
      const username = userName.split("@")[0];
      const parts = username.split(/[._-]+/);
      return {
        firstName: parts[0] ?? "",
        lastName: parts[1] ?? "",
      };
    }

    const parts = userName.split(" ");
    return {
      firstName: parts[0] ?? "",
      lastName: parts[1] ?? "",
    };
  };

  const { firstName, lastName } = getNameParts(state.user_name);

  const { form, onSubmit } = useMyProfile({
    email: state.user_email || "",
    firstName: firstName,
    lastName,
    phone: state.user_phone || "",
    country: state.user_country || "",
    address: state.user_city || "",
  });

  return (
    <React.Fragment>
      <Toaster richColors />
      <div className="space-y-5 ">
        <div className="space-y-5">
          <h4 className="text-xl  " id="profile">
            {t.title}
          </h4>
          <div>
            <Avatar className="w-20 h-20 border-2 border-green-500">
              <AvatarImage src={state.user_phone ?? ""} alt="@shadcn" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6 ">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {t.form.firstName.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.form.firstName.placeholder}
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {t.form.lastName.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.form.lastName.placeholder}
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {t.form.email.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.form.email.placeholder}
                          type="email"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {t.form.phone.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.form.phone.placeholder}
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
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {t.form.country.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.form.country.placeholder}
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {t.form.address.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.form.address.placeholder}
                          type="text"
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
                  <Button className="p-6">{t.form.button.update}</Button>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-5">
          <h4 className="text-xl" id="security">
            Segurança
          </h4>
          <Form {...formUpdatePassword}>
            <form
              onSubmit={formUpdatePassword.handleSubmit(
                onSubmitUpdatePassword,
              )}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6 ">
                <FormField
                  control={formUpdatePassword.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {tUpdatePassword.fields.oldPassword.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            tUpdatePassword.fields.oldPassword.placeholder
                          }
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
                  control={formUpdatePassword.control}
                  name="newpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {tUpdatePassword.fields.newPassword.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            tUpdatePassword.fields.newPassword.placeholder
                          }
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
                    {isLoading && <Spinner />}
                    {tUpdatePassword.button.submit}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-5">
          <h4 className="text-xl" id="delete-account">
            Apagar conta
          </h4>
          <p className="text-sm text-muted-foreground">
            {tProfileLayout.alertDialog.dialogDescription}
          </p>

          <Button
            variant="outline"
            className="text-red-400 opacity-60 transition-all duration-300 hover:text-red-400 hover:backdrop-opacity-100">
            Apagar conta
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export { Settings };
