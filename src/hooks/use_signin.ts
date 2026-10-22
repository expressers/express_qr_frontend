import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { authService } from "@/service/api";
import { getErrorCode, getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";
import { useLoadingPage } from "./use_loadingPage";

function useSignIn() {
  const { translations } = useLang();
  const { setIsVisible } = useLoadingPage();
  const t = translations.pages.SignIn;
  // No login não se valida a complexidade da password: isso é regra do registo.
  const schema = z.object({
    email: z.string().nonempty(t.validation.emailRequired).email(t.validation.emailInvalid),
    password: z.string().nonempty(t.validation.passwordRequired),
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(value: z.infer<typeof schema>) {
    try {
      setIsLoading(true);
      await authService.login({ email: value.email, password: value.password });
      navigate("/dashboard", { replace: true });
      toast.success(t.toastSuccess);
      setIsVisible(true);
    } catch (error) {
      if (getErrorCode(error) === "EMAIL_NOT_VERIFIED") {
        toast.info(translations.errors.EMAIL_NOT_VERIFIED);
        navigate("/auth/verify-account", { state: { email: value.email } });
        return;
      }
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

export { useSignIn };
