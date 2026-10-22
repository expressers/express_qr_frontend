import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/service/api";
import { getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";

/** Reenvio do email de verificação (público, resposta neutra). */
function useResendVerification() {
  const { translations } = useLang();
  const t = translations.pages.Verifyaccount;
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function resend(email: string) {
    try {
      setIsLoading(true);
      await authService.resendVerification(email);
      setSent(true);
      toast.success(t.resendSuccess);
    } catch (error) {
      toast.error(getErrorMessage(error, translations.errors, t.resendError));
    } finally {
      setIsLoading(false);
    }
  }

  return { resend, isLoading, sent };
}

export { useResendVerification };
