import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { authService } from "@/service/api";
import { getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";

function useForgotPassword() {
  const navigate = useNavigate();
  const { translations } = useLang();
  const t = translations.pages.ForgotPassword;
  const schema = z.object({
    email: z.string().nonempty(t.validation.requiredEmail).email(t.validation.invalidEmail),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(value: z.infer<typeof schema>) {
    try {
      setIsLoading(true);
      await authService.forgotPassword({ email: value.email });
      // Resposta neutra: não revela se o email existe. Sem sessão, volta ao login.
      toast.success(t.toastSuccess);
      navigate("/auth/signin", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, translations.errors, t.toastError));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    onSubmit,
    isLoading,
  };
}

export { useForgotPassword };
