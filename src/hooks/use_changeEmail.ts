import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { userService } from "@/service/api";
import { applyFieldErrors, getErrorCode, getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";

/** Pedido de mudança de email: envia o link de confirmação para o novo endereço. */
function useChangeEmail(currentEmail?: string | null) {
  const { translations } = useLang();
  const t = translations.pages.Settings.changeEmail;
  const [isLoading, setIsLoading] = useState(false);
  /** Endereço para onde o link seguiu; `null` enquanto o formulário está por preencher. */
  const [sentTo, setSentTo] = useState<string | null>(null);

  const schema = z
    .object({
      newEmail: z
        .string()
        .trim()
        .min(1, t.validation.required)
        .email(t.validation.invalid),
      currentPassword: z.string().min(1, t.validation.passwordRequired),
    })
    .refine(
      (value) => !currentEmail || value.newEmail.toLowerCase() !== currentEmail.toLowerCase(),
      { path: ["newEmail"], message: t.validation.same },
    );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { newEmail: "", currentPassword: "" },
  });

  async function onSubmit(value: z.infer<typeof schema>) {
    try {
      setIsLoading(true);
      await userService.changeEmail({
        newEmail: value.newEmail,
        currentPassword: value.currentPassword,
      });
      form.reset();
      setSentTo(value.newEmail);
    } catch (error) {
      // Senha errada é 400 INVALID_CURRENT_PASSWORD: erro do campo, a sessão mantém-se.
      const code = getErrorCode(error);
      if (code === "INVALID_CURRENT_PASSWORD") {
        form.setError("currentPassword", {
          type: "server",
          message: translations.errors.INVALID_CURRENT_PASSWORD,
        });
      } else if (code === "EMAIL_IN_USE") {
        form.setError("newEmail", { type: "server", message: translations.errors.EMAIL_IN_USE });
      } else {
        applyFieldErrors(
          error,
          form.setError,
          { newEmail: "newEmail", currentPassword: "currentPassword" },
          translations.errors.FIELD_INVALID,
        );
        toast.error(getErrorMessage(error, translations.errors, t.toastError));
      }
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    form.reset();
    setSentTo(null);
  }

  return { form, onSubmit, isLoading, sentTo, reset };
}

export { useChangeEmail };
