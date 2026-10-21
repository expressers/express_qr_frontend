
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useLang } from "./use_Lang";
import { authService } from "@/service/api";



function useForgotPassword() {
  const navigate = useNavigate();
  const { translations } = useLang()
  const t = translations.pages.ForgotPassword;
  const schema = z.object({
    email: z
      .string()
      .nonempty(t.validation.requiredEmail)
      .email(t.validation.invalidEmail),
  });
    const [isLoading, setIsLoading] = useState<boolean>(false);
        const form = useForm<z.infer<typeof schema>>({
          resolver: zodResolver(schema),
          defaultValues: {
            email: "",
            
          },
        });
    
        async function onSubmit(value: z.infer<typeof schema>) {
              
          
              const payload = {
                  email: value.email,
                 
              };
          console.log(payload);
          
              try {
                setIsLoading(true);

                const response = await authService.forgotPassword(payload);
          
                if (response.status !== 200) {
                  throw new Error(`Erro ${response.status}`);
                }
          
                
                toast.success("Verifica seu email.", {
                  className: "bg-green-500 text-white font-semibold",
                });
        
                console.log(response);
                navigate("/dashboard", { replace: true });
              } catch (error) {
                
                toast.error("Erro ao ", {
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

export {useForgotPassword}