import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLang } from "./use_Lang"
  import { userService } from "@/service/api";
import { useState } from "react";
import { toast } from "sonner";
;


function useUpdatePassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const { translations } = useLang();
    const t = translations.pages.UpdatePassword;
    const schema = z
      .object({
        oldPassword: z
          .string()
          .nonempty(t.validation.requiredOld)
          .min(8, t.validation.min)
          .regex(/[0-9]/, t.validation.number)
          .regex(/[a-zA-Z]/, t.validation.letter)
          .regex(/[^a-zA-Z0-9]/, t.validation.special),
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
        const payload = {
          currentPassword: value.oldPassword,
          newPassword: value.newpassword,
        };
       try {
         
         const response = await userService.changePassword(payload);
         

         if (!response.data.success) {
          
           throw new Error(`Erro ${response.status}`);
         }
         
         toast.success("Senha alterada com sucesso", {
           className: "bg-green-500 text-white font-semibold",
         });
       } catch (error) {
         toast.error("Erro ao atualizar perfil", {
           className: "bg-red-500/10 text-white font-semibold",
         });
         console.error("Error fetching user data:", error);
       } finally {
         setIsLoading(false);
       }
    }
    return { form, onSubmit, isLoading };
}

export { useUpdatePassword };