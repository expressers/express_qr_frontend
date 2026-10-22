import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { Button, Input, Label, Spinner } from "@/components";
import { AuthShell } from "@/components/authShell";
import { useLang, useResendVerification } from "@/hooks";

function Verifyaccount() {
  const { translations } = useLang();
  const t = translations.pages.Verifyaccount;
  const location = useLocation();
  // O email chega pelo estado da navegação (signup/signin), nunca pelo URL.
  const initialEmail = (location.state as { email?: string } | null)?.email ?? "";
  const [email, setEmail] = useState(initialEmail);
  const { resend, isLoading } = useResendVerification();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (email.trim()) resend(email.trim());
  }

  return (
    <AuthShell layout="centered">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="flex size-12 items-center justify-center rounded-full border border-border bg-muted">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h1 className="text-balance text-2xl font-semibold tracking-tight">{t.title}</h1>
            <p className="text-pretty text-sm text-muted-foreground">{t.subtitle}</p>
            <p className="text-pretty text-sm text-subtle-foreground">{t.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} aria-busy={isLoading} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resend-email" className="text-sm">
              {t.emailLabel}
            </Label>
            <Input
              id="resend-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              placeholder={t.emailPlaceholder}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading || !email.trim()}>
            {isLoading && <Spinner />}
            {t.resendButton}
          </Button>
        </form>

        <Link
          to="/auth/signin"
          className="rounded-md py-1 text-center text-sm font-medium underline underline-offset-4">
          {t.button}
        </Link>
      </div>
    </AuthShell>
  );
}

export { Verifyaccount };
