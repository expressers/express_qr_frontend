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
  FormDescription,
  FormMessage,
  Spinner,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components";
import React from "react";

import {
  useDeleteAccount,
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
  const { DeleteAccount } = useDeleteAccount();

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

  const { form, onSubmit, isLoading: isSavingProfile } = useMyProfile({
    email: state.user_email || "",
    firstName: firstName,
    lastName,
    phone: state.user_phone || "",
  });

  return (
    <React.Fragment>
      <div className="space-y-5 ">
        <div className="space-y-5">
          <h4 className="text-xl  " id="profile">
            {t.title}
          </h4>
          <div>
            <Avatar className="w-20 h-20 border-2 border-green-500">
              <AvatarImage src={state.user_photo ?? ""} alt={state.user_name ?? ""} />
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
                          readOnly
                          aria-readonly="true"
                          aria-describedby="email-readonly-hint"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription id="email-readonly-hint" className="text-xs">
                        {t.form.email.readOnlyHint}
                      </FormDescription>
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
                <div className="md:block hidden"></div>
                <div className="flex justify-end">
                  <Button className="p-6" type="submit" disabled={isSavingProfile}>
                    {isSavingProfile && <Spinner />}
                    {t.form.button.update}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-5">
          <h4 className="text-xl" id="security">
            {tProfileLayout.menu.security}
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
            {tProfileLayout.menu.delete}
          </h4>
          <p className="text-sm text-muted-foreground">
            {tProfileLayout.alertDialog.dialogDescription}
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">{tProfileLayout.menu.delete}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{tProfileLayout.alertDialog.dialogTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {tProfileLayout.deleteConfirm}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{tProfileLayout.alertDialog.dialogCancel}</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={DeleteAccount}>
                  {tProfileLayout.alertDialog.dialogAction}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </React.Fragment>
  );
}

export { Settings };
