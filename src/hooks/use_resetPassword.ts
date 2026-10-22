import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "@/service/api";
import { getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";

/** Reposição de password a partir do link do email (`/reset-password?token=`). */
function useResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { translations } = useLang();
  const t = translations.pages.ResetPassword;

  const password = z
    .string()
    .nonempty(t.validation.requiredNew)
    .min(8, t.validation.min)
    .regex(/[0-9]/, t.validation.number)
    .regex(/[a-zA-Z]/, t.validation.letter)
    .regex(/[^a-zA-Z0-9]/, t.validation.special);

  const schema = z
    .object({
      password,
      confPassword: z.string().nonempty(t.validation.requiredConfirm),
    })
    .refine((data) => data.password === data.confPassword, {
      path: ["confPassword"],
      message: t.validation.match,
    });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confPassword: "",
    },
  });

  async function onSubmit(value: z.infer<typeof schema>) {
    if (!token) {
      toast.error(t.missingToken);
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword({ token, newPassword: value.password });
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
    hasToken: Boolean(token),
  };
}

export { useResetPassword };
