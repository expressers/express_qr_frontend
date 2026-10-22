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
import React, { useState } from "react";

import {
  useDeleteAccount,
  useLang,
  useMyProfile,
  useUpdatePassword,
  useUserAccount,
} from "@/hooks";
import { Trash2 } from "lucide-react";
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
  const tSettings = translations.pages.Settings;
  const { DeleteAccount } = useDeleteAccount();
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText.trim().toUpperCase() === tSettings.confirmWord;

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
      <div className="divide-y [&>section]:py-8 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0">
        <section className="space-y-6" aria-labelledby="profile">
          <header className="space-y-1">
            <h2 className="text-xl font-semibold tracking-[-0.01em]" id="profile">
              {t.title}
            </h2>
            <p className="text-sm text-muted-foreground">{tSettings.profileDesc}</p>
          </header>
          <div className="flex items-center gap-4">
            <Avatar className="size-16 ring-1 ring-border ring-offset-2 ring-offset-card">
              <AvatarImage src={state.user_photo ?? ""} alt={state.user_name ?? ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{state.user_name}</p>
              <p className="truncate text-sm text-muted-foreground">{state.user_email}</p>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 items-start gap-x-6 gap-y-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.form.firstName.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.form.firstName.placeholder}
                          type="text"
                          autoComplete="given-name"
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
                      <FormLabel>{t.form.lastName.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.form.lastName.placeholder}
                          type="text"
                          autoComplete="family-name"
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
                      <FormLabel>{t.form.email.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.form.email.placeholder}
                          type="email"
                          className="bg-muted text-muted-foreground"
                          readOnly
                          aria-readonly="true"
                          aria-describedby="email-readonly-hint"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription id="email-readonly-hint">
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
                      <FormLabel>{t.form.phone.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.form.phone.placeholder}
                          type="tel"
                          autoComplete="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button size="lg" className="w-full sm:h-10 sm:w-auto" type="submit" disabled={isSavingProfile}>
                  {isSavingProfile && <Spinner />}
                  {t.form.button.update}
                </Button>
              </div>
            </form>
          </Form>
        </section>

        <section className="space-y-6" aria-labelledby="security">
          <header className="space-y-1">
            <h2 className="text-xl font-semibold tracking-[-0.01em]" id="security">
              {tProfileLayout.menu.security}
            </h2>
            <p className="text-sm text-muted-foreground">{tSettings.securityDesc}</p>
          </header>
          <Form {...formUpdatePassword}>
            <form
              className="space-y-6"
              onSubmit={formUpdatePassword.handleSubmit(onSubmitUpdatePassword)}>
              <div className="grid grid-cols-1 items-start gap-x-6 gap-y-5 md:grid-cols-2">
                <FormField
                  control={formUpdatePassword.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tUpdatePassword.fields.oldPassword.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tUpdatePassword.fields.oldPassword.placeholder}
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
                  control={formUpdatePassword.control}
                  name="newpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tUpdatePassword.fields.newPassword.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tUpdatePassword.fields.newPassword.placeholder}
                          type="password"
                          autoComplete="new-password"
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
                  {tUpdatePassword.button.submit}
                </Button>
              </div>
            </form>
          </Form>
        </section>

        <section className="space-y-4" aria-labelledby="delete-account">
          <header className="space-y-1">
            <h2 className="text-xl font-semibold tracking-[-0.01em]" id="delete-account">
              {tProfileLayout.menu.delete}
            </h2>
            <p className="max-w-prose text-sm text-muted-foreground">{tSettings.dangerDesc}</p>
          </header>

          <AlertDialog onOpenChange={(open) => !open && setConfirmText("")}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg" className="w-full sm:h-10 sm:w-auto">
                <Trash2 aria-hidden />
                {tSettings.deleteAction}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{tProfileLayout.alertDialog.dialogTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {tProfileLayout.alertDialog.dialogDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2">
                <label htmlFor="confirm-delete" className="text-sm font-medium">
                  {tSettings.confirmLabel.replace("{word}", tSettings.confirmWord)}
                </label>
                <Input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="font-mono"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>{tProfileLayout.alertDialog.dialogCancel}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={!canDelete}
                  onClick={DeleteAccount}>
                  {tSettings.deleteAction}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </React.Fragment>
  );
}

export { Settings };
