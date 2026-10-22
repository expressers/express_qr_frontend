
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Button,
  Spinner,
  Checkbox,
} from "@/components";
import { AuthShell, FieldError, PasswordInput } from "@/components/authShell";
import { GoogleMark } from "@/components/googleMark/googleMark";
import { Link } from "react-router-dom";
import { useLang, useSignIn, useSigninGoogle } from "@/hooks";

function SignIn() {
  const { form, onSubmit, isLoading } = useSignIn();
  const { translations } = useLang();
  const t = translations.pages.SignIn;
  const { login } = useSigninGoogle();

  return (
    <AuthShell>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          aria-busy={isLoading}
          className="space-y-5">
          <div className="space-y-1.5">
            <h1 className="text-balance text-[1.75rem] font-semibold leading-tight tracking-tight">
              {t.welcome}
            </h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel className="text-sm">{t.email}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.emailPlaceholder}
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FieldError />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel className="text-sm">{t.password}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t.passwordPlaceholder}
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FieldError />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox />
              {t.rememberMe}
            </label>
            <Link
              to="/auth/forgotpassword"
              className="rounded-sm text-sm underline-offset-4 hover:underline">
              {t.forgotPassword}
            </Link>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading && <Spinner />}
            {t.login}
          </Button>

          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">{t.orContinue}</span>
            <span aria-hidden className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => login()}>
            <GoogleMark aria-hidden="true" className="size-4" />
            {t.continueGoogle}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t.noAccount}{" "}
            <Link
              to="/auth/signup"
              className="font-semibold text-foreground underline underline-offset-4">
              {t.signupHere}
            </Link>
          </p>
        </form>
      </Form>
    </AuthShell>
  );
}

export { SignIn };
