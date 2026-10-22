import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { Button, Input, Label, Spinner } from "@/components";
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
    <React.Fragment>
      <div className="min-h-screen w-full flex items-center justify-center p-2 bg-gray-800/10">
        <div className="dark:bg-black bg-white flex flex-col gap-6 justify-center items-center px-6 py-10 lg:w-1/3 md:w-1/2 sm:w-2/3 w-full rounded-md">
          <MailCheck size={30} aria-hidden />
          <h4 className="sm:text-2xl text-xl font-bold text-center">{t.title}</h4>
          <div className="space-y-2">
            <p className="text-center text-sm">{t.subtitle}</p>
            <p className="text-center text-sm">{t.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <div className="space-y-1">
              <Label htmlFor="resend-email" className="text-xs">
                {t.emailLabel}
              </Label>
              <Input
                id="resend-email"
                type="email"
                required
                value={email}
                placeholder={t.emailPlaceholder}
                onChange={(event) => setEmail(event.target.value)}
                className="py-5 text-xs"
              />
            </div>
            <Button type="submit" className="w-full p-5" disabled={isLoading || !email.trim()}>
              {isLoading && <Spinner />}
              {t.resendButton}
            </Button>
          </form>

          <Link to="/auth/signin" className="text-xs font-semibold underline">
            {t.button}
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}

export { Verifyaccount };
