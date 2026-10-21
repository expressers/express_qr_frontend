import  { useState } from 'react'
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { qrCodeService, type GererateQRcodeStaticProps } from "@/service/api";

const schema = z.object({
  url: z.string().nonempty("A url é obrigatoria").min(1, "Adiciona url"),
  
});


function useGenerateQr() {
  
  const [data, setData] = useState<GererateQRcodeStaticProps["data"] | null>(null);
  
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

   const {
      register,
      formState: { errors },
      handleSubmit,
    } = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
    });
  
    async function onSubmit(value: z.infer<typeof schema>) {
      const payload: { content: string; format: "png" | "svg" | "pdf" } = {
        content: value.url,

        format: "svg",
      }; ;
  
      try {
        setIsLoading(true);
        const response = await qrCodeService.gererateQRcodeStatic(payload);

        
        const { data } = response.data;
         
        if (response.data.success== false) {
          throw new Error(`Erro ${response.status}`);
        }

        
       
        setData(data);
       
        toast.success("Qrcode criado com sucesso!", {
          className: "bg-green-500 text-white font-semibold",
        });

       
      } catch (error) {
        
        toast.error("Erro ao criar o Qrcode!", {
          className: "bg-red-500/10 text-white font-semibold",
        });
        
        console.error("error:", error);

      } finally {
        setIsLoading(false);
      }
    }
  
  return {
    isLoading,
    register,
    errors,
    handleSubmit,
    onSubmit,
    data,
  };
}

export {useGenerateQr}