import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { userService } from "@/service/api";
import { applyFieldErrors, getErrorCode, getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";

function useUpdatePassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { translations } = useLang();
  const t = translations.pages.UpdatePassword;
  const schema = z
    .object({
      oldPassword: z.string().nonempty(t.validation.requiredOld),
      newpassword: z
        .string()
        .nonempty(t.validation.requiredNew)
        .min(8, t.validation.min)
        .regex(/[0-9]/, t.validation.number)
        .regex(/[a-zA-Z]/, t.validation.letter)
        .regex(/[^a-zA-Z0-9]/, t.validation.special),
    })
    .refine((data) => data.oldPassword !== data.newpassword, {
      path: ["newpassword"],
      message: t.validation.match,
    });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      newpassword: "",
      oldPassword: "",
    },
  });

  async function onSubmit(value: z.infer<typeof schema>) {
    try {
      setIsLoading(true);
      await userService.changePassword({
        currentPassword: value.oldPassword,
        newPassword: value.newpassword,
      });
      form.reset();
      toast.success(t.toastSuccess);
    } catch (error) {
      // Senha actual errada → 400 INVALID_CURRENT_PASSWORD: erro do formulário,
      // a sessão mantém-se.
      if (getErrorCode(error) === "INVALID_CURRENT_PASSWORD") {
        form.setError("oldPassword", {
          type: "server",
          message: translations.errors.INVALID_CURRENT_PASSWORD,
        });
      } else {
        applyFieldErrors(
          error,
          form.setError,
          { currentPassword: "oldPassword", newPassword: "newpassword" },
          translations.errors.FIELD_INVALID,
        );
      }
      toast.error(getErrorMessage(error, translations.errors, t.toastError));
    } finally {
      setIsLoading(false);
    }
  }

  return { form, onSubmit, isLoading };
}

export { useUpdatePassword };
