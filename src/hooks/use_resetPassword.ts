import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useLang } from "./use_Lang";
import { authService } from "@/service/api";



function useResetPassword() {
  const navigate = useNavigate();
  const { translations } = useLang();
  const t = translations.pages.ResetPassword;
  const schema = z
    .object({
      password: z
        .string()
        .nonempty(t.validation.requiredNew)
        .min(8, t.validation.min)
        .regex(/[0-9]/, t.validation.number)
        .regex(/[a-zA-Z]/, t.validation.letter)
        .regex(
          /[^a-zA-Z0-9]/,
          t.validation.special,
        ),
      confPassword: z
        .string()
        .nonempty(t.validation.requiredNew)
        .min(8, t.validation.min)
        .regex(/[0-9]/, t.validation.number)
        .regex(/[a-zA-Z]/, t.validation.letter)
        .regex(
          /[^a-zA-Z0-9]/,
          t.validation.special,
        ),
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
    const payload = {
      newPassword: value.password,
    };
    console.log(payload);

    try {
      setIsLoading(true);

      const response = await authService.resetPassword(payload);

      if (!response.data.success) {
        throw new Error(`Erro ${response.status}`);
      }

      toast.success("Senha redifinida", {
        className: "bg-green-500 text-white font-semibold",
      });

      console.log(response);
      
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error("Erro a redifinir senha.", {
        className: "bg-red-500/10 text-white font-semibold",
      });

      console.error("error:", error);
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

export { useResetPassword };
