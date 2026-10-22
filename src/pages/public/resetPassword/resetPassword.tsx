import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Button,
  Spinner,
} from "@/components";
import { AuthShell, FieldError, PasswordInput } from "@/components/authShell";
import { ChevronLeft, LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang, useResetPassword } from "@/hooks";

function ResetPassword() {
  const { form, onSubmit, isLoading, hasToken } = useResetPassword();
  const { translations } = useLang();
  const t = translations.pages.ResetPassword;

  return (
    <AuthShell>
      {!hasToken ? (
        <div className="space-y-5">
          <span className="flex size-12 items-center justify-center rounded-full border border-border bg-muted">
            <LinkIcon className="size-5" aria-hidden="true" />
          </span>
          <div className="space-y-1.5">
            <h1 className="text-balance text-[1.75rem] font-semibold leading-tight tracking-tight">
              {t.missingTokenTitle}
            </h1>
            <p className="text-pretty text-sm text-muted-foreground">{t.missingToken}</p>
          </div>
          <Button asChild size="lg" className="w-full">
            <Link to="/auth/forgotpassword">{t.requestNewLink}</Link>
          </Button>
          <Link
            to="/auth/signin"
            className="flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium underline-offset-4 hover:underline">
            <ChevronLeft className="size-4" aria-hidden="true" />
            {t.back}
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            aria-busy={isLoading}
            className="space-y-5">
            <div className="space-y-1.5">
              <h1 className="text-balance text-[1.75rem] font-semibold leading-tight tracking-tight">
                {t.title}
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">{t.subtitle}</p>
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="text-sm">{t.newPassword}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t.newPasswordPlaceholder}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FieldError />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confPassword"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="text-sm">{t.confirmNewPassword}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t.confirmNewPasswordPlaceholder}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FieldError />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading && <Spinner />}
              {t.button}
            </Button>

            <Link
              to="/auth/signin"
              className="flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium underline-offset-4 hover:underline">
              <ChevronLeft className="size-4" aria-hidden="true" />
              {t.back}
            </Link>
          </form>
        </Form>
      )}
    </AuthShell>
  );
}

export { ResetPassword };
