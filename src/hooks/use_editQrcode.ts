import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { qrCodeService } from "@/service/api";
import { toast } from "sonner";
import { CACHE } from "@/utils";
import { useNavigate } from "react-router-dom";

interface useEditQrcodeProps {
  link: string;
  id: string;
  title?: string | null;
  tags?: string | null;
  description?: string | null;
}

function useEditQrcode({
  link,
  title,
  id,
  tags,
  description,
}: useEditQrcodeProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const schema = z.object({
    link: z.string().nonempty("O Link é obrigatorio"),
    title: z.string().nonempty("O Link é obrigatorio"),
    id: z.string(),
    tags: z.string().optional(),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      link: link || "",
      title: title || "",
      id: id,
      tags: tags || "",
      description: description || "",
    },
  });

  async function onSubmit(value: z.infer<typeof schema>) {
    const payload = {
      link: value.link,
      title: value.title,
    };
    try {
      setIsLoading(true);

      const response = await qrCodeService.update(value.id, payload);
      console.log(response);

      if (!response.data.success) {
        throw new Error(`Erro ${response.status}`);
      }
      CACHE.clearByPrefix("qrcodes-");
      toast.success("Atualizado com sucesso!", {
        className: "bg-green-500 text-white font-semibold",
      });
       navigate("/dashboard/my-qrcodes");
    } catch (error) {
      toast.error("Erro ao atualizar", {
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

export { useEditQrcode };
