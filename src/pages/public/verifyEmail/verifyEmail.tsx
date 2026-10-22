import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { Button, Spinner } from "@/components";
import { authService } from "@/service/api";
import { useLang } from "@/hooks";
import { getErrorCode, getErrorMessage } from "@/utils";

type Status = "loading" | "success" | "error";

function VerifyEmail() {
  const { translations } = useLang();
  const t = translations.pages.VerifyEmail;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : t.tokenNotProvided);
  // O token é de uso único: em StrictMode o efeito corre duas vezes e a 2.ª chamada falharia.
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;

    authService
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((error) => {
        if (getErrorCode(error) === "EMAIL_ALREADY_VERIFIED") {
          setStatus("success");
          return;
        }
        setMessage(getErrorMessage(error, translations.errors, t.errorDescription));
        setStatus("error");
      });
  }, [token, translations.errors, t.errorDescription]);

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => navigate("/auth/signin"), 5000);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  return (
    <React.Fragment>
      <div className="min-h-screen w-full flex items-center justify-center p-2 bg-gray-800/10">
        <div className="dark:bg-black bg-white flex flex-col gap-6 justify-center items-center p-6 rounded-md max-w-md w-full text-center">
          <MailCheck size={30} aria-hidden />

          {status === "loading" && (
            <>
              <h4 className="sm:text-2xl text-xl font-bold">{t.verifyingTitle}</h4>
              <p className="text-sm">{t.verifyingSubtitle}</p>
              <Spinner />
            </>
          )}

          {status === "success" && (
            <>
              <h4 className="sm:text-2xl text-xl font-bold">{t.successTitle}</h4>
              <p className="text-sm">{t.successDescription}</p>
              <p className="text-xs text-muted-foreground">{t.redirectMessage}</p>
              <Button className="p-6" onClick={() => navigate("/auth/signin")}>
                {t.buttonLogin}
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <h4 className="sm:text-2xl text-xl font-bold">{t.errorTitle}</h4>
              <p className="text-sm">{message || t.errorDescription}</p>
              <Button className="p-6" asChild>
                <Link to="/auth/verify-account">{t.resendLink}</Link>
              </Button>
              <Link to="/auth/signin" className="text-xs underline">
                {t.buttonLogin}
              </Link>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export { VerifyEmail };
