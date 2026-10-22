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
import { AuthShell, FieldError } from "@/components/authShell";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang, useForgotPassword } from "@/hooks";

function ForgotPassword() {
  const { form, onSubmit, isLoading } = useForgotPassword();
  const { translations } = useLang();
  const t = translations.pages.ForgotPassword;

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
            <p className="text-pretty text-sm text-muted-foreground">{t.subtitle}</p>
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

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading && <Spinner />}
            {t.button}
          </Button>

          <Link
            to="/auth/signin"
            className="flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium underline-offset-4 hover:underline">
            <ChevronLeft className="size-4" aria-hidden="true" />
            {t.backToLogin}
          </Link>
        </form>
      </Form>
    </AuthShell>
  );
}

export { ForgotPassword };
