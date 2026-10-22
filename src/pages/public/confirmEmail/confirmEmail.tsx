import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, MailCheck } from "lucide-react";
import { Button, Spinner } from "@/components";
import { AuthShell } from "@/components/authShell";
import { userService } from "@/service/api";
import { useLang, useUserAccount } from "@/hooks";
import { getErrorMessage } from "@/utils";

type Status = "loading" | "success" | "error";

/** Destino do link do email "confirmar novo email". Aplica a mudança e pede novo login. */
function ConfirmEmail() {
  const { translations } = useLang();
  const t = translations.pages.ConfirmEmail;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useUserAccount();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : t.tokenNotProvided);
  const [email, setEmail] = useState("");
  // O token é de uso único: em StrictMode o efeito corre duas vezes e a 2.ª chamada falharia.
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;

    userService
      .confirmEmail(token)
      .then((result) => {
        // O servidor revogou as sessões: limpa também o que ficou guardado neste browser.
        dispatch({ type: "LOGOUT" });
        setEmail(result.email);
        setStatus("success");
      })
      .catch((error) => {
        setMessage(getErrorMessage(error, translations.errors, t.errorDescription));
        setStatus("error");
      });
  }, [token, dispatch, translations.errors, t.errorDescription]);

  return (
    <AuthShell layout="centered">
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-5 text-center">
        {status === "loading" && (
          <>
            <StatusIcon>
              <Spinner className="size-5" />
            </StatusIcon>
            <div className="space-y-1.5">
              <h1 className="text-balance text-2xl font-semibold tracking-tight">{t.verifyingTitle}</h1>
              <p className="text-pretty text-sm text-muted-foreground">{t.verifyingSubtitle}</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <StatusIcon>
              <MailCheck className="size-5" aria-hidden="true" />
            </StatusIcon>
            <div className="space-y-1.5">
              <h1 className="text-balance text-2xl font-semibold tracking-tight">{t.successTitle}</h1>
              <p className="text-pretty break-words text-sm text-foreground">
                {t.successDescription.replace("{email}", email)}
              </p>
              <p className="text-pretty text-sm text-muted-foreground">{t.signInAgain}</p>
            </div>
            <Button size="lg" className="w-full" onClick={() => navigate("/auth/signin", { replace: true })}>
              {t.signIn}
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <StatusIcon tone="error">
              <AlertCircle className="size-5" aria-hidden="true" />
            </StatusIcon>
            <div className="space-y-1.5">
              <h1 className="text-balance text-2xl font-semibold tracking-tight">{t.errorTitle}</h1>
              <p className="text-pretty text-sm font-medium text-destructive">
                {message || t.errorDescription}
              </p>
            </div>
            <Button size="lg" className="w-full" asChild>
              <Link to="/dashboard/settings">{t.goToSettings}</Link>
            </Button>
            <Link to="/auth/signin" className="rounded-md py-1 text-sm font-medium underline underline-offset-4">
              {t.signIn}
            </Link>
          </>
        )}
      </div>
    </AuthShell>
  );
}

function StatusIcon({ children, tone }: { children: React.ReactNode; tone?: "error" }) {
  return (
    <span
      className={
        tone === "error"
          ? "flex size-12 items-center justify-center rounded-full border-[1.5px] border-destructive text-destructive"
          : "flex size-12 items-center justify-center rounded-full border border-border bg-muted"
      }>
      {children}
    </span>
  );
}

export { ConfirmEmail };
