
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { authService } from "@/service/api";
import { useLang } from "./use_Lang";
import { useLoadingPage } from "./use_loadingPage";



function useSignIn() {
  const { translations } = useLang();
 const { setIsVisible } = useLoadingPage();
  const t = translations.pages.SignIn;
  const schema = z.object({
    email: z
      .string()
      .nonempty(t.validation.emailRequired)
      .email(t.validation.emailInvalid),
    password: z
      .string()
      .nonempty(t.validation.passwordRequired)
      .min(8, t.validation.min)
     .regex(/[0-9]/, t.validation.number)
      .regex(/[a-zA-Z]/, t.validation.letter)
      .regex(
        /[^a-zA-Z0-9]/,
        t.validation.special,
      ),
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
              
          
              const payload = {
                email: value.email,
                password: value.password,
              };
          
              try {
                
                setIsLoading(true);
                
                const response = await authService.login(payload);
               
                
                if (!response.data.success)  {
                  throw new Error(`Erro ${response.status}`);
                }
                
                 
               
               
                navigate("/dashboard", { replace: true });
                toast.success("Sessão iniciada com sucesso!", {
                  className: "bg-green-500 text-white font-semibold",
                });
                 setIsVisible(true);
              } catch (error) {
                
                toast.error("Erro ao iniciar a sessão", {
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

export {useSignIn}