import { useState } from "react";
import { toast } from "sonner";
import {  z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { userService } from "@/service/api";
import { useLang } from "./use_Lang";


function useSignUp() {
  const { translations } = useLang();
  const t = translations.pages.SignUp;
  const schema = z
    .object({
      firstName: z
        .string()
        .nonempty(t.validation.firstNameRequired)
        .min(3, t.validation.firstNameMin),
      lastName: z
        .string()
        .nonempty(t.validation.lastNameRequired)
        .min(3, t.validation.lastNameMin),
      email: z
        .string()
        .nonempty(t.validation.emailRequired)
        .email(t.validation.emailInvalid),
      password: z
        .string()
        .nonempty(t.validation.passwordRequired)
        .min(8, t.validation.passwordMin)
        .regex(/[0-9]/, t.validation.passwordNumber)
        .regex(/[a-zA-Z]/, t.validation.passwordLetter)
        .regex(
          /[^a-zA-Z0-9]/,
          t.validation.passwordSpecial,
        ),
      confpassword: z.string().nonempty(t.validation.confpasswordRequired),
    })
    .refine((data) => data.password === data.confpassword, {
      path: ["confpassword"],
      message: t.validation.passwordMatch,
    });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confpassword: "",
    },
  });

  async function onSubmit(value: z.infer<typeof schema>) {
    const payload = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      password: value.password,
    };

    try {
      setIsLoading(true);

      const response = await userService.register(payload);

     

      if ( response.data.success === false) {
        throw new Error(`Erro ${response.status}`);
      }

     
      toast.success("Conta criada com sucesso!", {
        className: "bg-green-500 text-white font-semibold",
      });
      navigate("/auth/verify-account", { replace: true });
     
    
      
    } catch (error) {
      toast.error("Erro ao criar conta", {
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

export { useSignUp };
