import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { qrCodeService, type PublicStaticQr } from "@/service/api";
import { getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";

const MAX_CONTENT = 2000;

/** Gerador anónimo da home: estático, sem persistência no servidor. */
function useGenerateQr() {
  const { translations } = useLang();
  const t = translations.components.FormGeneratorQrc;

  const schema = z.object({
    url: z
      .string()
      .trim()
      .min(1, t.validation.required)
      .max(MAX_CONTENT, t.validation.tooLong),
  });

  const [data, setData] = useState<(PublicStaticQr & { content: string }) | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(value: z.infer<typeof schema>) {
    try {
      setIsLoading(true);
      const result = await qrCodeService.generatePublicStatic(value.url);
      setData({ ...result, content: value.url });
      toast.success(t.success);
    } catch (error) {
      toast.error(getErrorMessage(error, translations.errors, t.error));
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

export { useGenerateQr };
