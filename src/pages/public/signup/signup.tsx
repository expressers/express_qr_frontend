import { GoogleMark } from "@/components/googleMark/googleMark";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Button,
  Spinner,
} from "@/components";
import { AuthShell, FieldError, PasswordInput } from "@/components/authShell";

import { useLang, useSignUp, useSigninGoogle } from "@/hooks";

function SignUp() {
  const { form, onSubmit, isLoading } = useSignUp();
  const { translations } = useLang();
  const t = translations.pages.SignUp;
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
              {t.title}
            </h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="text-sm">{t.firstName}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.firstNamePlaceholder}
                      type="text"
                      autoComplete="given-name"
                      {...field}
                    />
                  </FormControl>
                  <FieldError />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="text-sm">{t.lastName}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.lastNamePlaceholder}
                      type="text"
                      autoComplete="family-name"
                      {...field}
                    />
                  </FormControl>
                  <FieldError />
                </FormItem>
              )}
            />
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
            name="confpassword"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel className="text-sm">{t.confirmPassword}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t.confirmPasswordPlaceholder}
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
            {t.haveAccount}{" "}
            <Link
              to="/auth/signin"
              className="font-semibold text-foreground underline underline-offset-4">
              {t.signinHere}
            </Link>
          </p>
        </form>
      </Form>
    </AuthShell>
  );
}

export { SignUp };
