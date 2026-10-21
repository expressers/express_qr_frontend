import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { qrCodeService, type QrCode } from "@/service/api";
import { useModalDialog } from "./use_modalDialog";
import { useGetQrcodes } from "./use_getQrcodes";
import { useLang } from "./use_Lang";
import { useNavigate } from "react-router-dom";

function useCreateQrcode() {
  const navigate = useNavigate()
  const { refetchQrcodes } = useGetQrcodes();
  const { translations } = useLang();
  const t = translations.components.CreateQrcode;
  const [data, setData] = useState<QrCode | null>(null);
  const { setVisibleDialogCreate } = useModalDialog();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = z.object({
    url: z
      .string()
      .nonempty(t.validation.requiredUrl)
      .url(t.validation.invalidUrl),
    title: z
      .string()
      .nonempty(t.validation.requiredTitle)
      .min(3, t.validation.minTitle),
    description: z.string().optional(),
    tags: z.string().optional(),
    type: z.enum(["STATIC", "DYNAMIC"]).refine((val) => val, {
      message: t.validation.requiredType,
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      tags: "",
      type: "STATIC",
    },
  });

  async function onSubmit(value: z.infer<typeof schema>) {


    const payload = {
      type: value.type,
      title: value.title,
      ...(value.type === "STATIC" && { staticContent: value.url }),
      ...(value.type === "DYNAMIC" && { targetUrl: value.url }),
      description: value.description,
      tags: value.tags ? value.tags.split(",") : undefined,
    } as const;

    try {
      setIsLoading(true);
      const response = await qrCodeService.create(payload);
      const { data } = response.data;
    
      if (response.status !== 201) {
        throw new Error(`Erro ${response.status}`);
      }

      setData(data);
      setVisibleDialogCreate(false);
      await refetchQrcodes();
      toast.success(t.validation.toastSucces, {
        className: "bg-green-500 text-white font-semibold",
      });
    } catch (error: any) {
      const status =
        error?.response?.status ||
        error?.status || 
        (error.message?.match(/\d+/)?.[0] ?? null);

      if (status === "403") {
        setVisibleDialogCreate(false);
        toast.error(t.validation.execeedeLim, {
          className: "bg-red-400/10 text-white font-semibold",
          action: {
            label: t.validation.btnAction,
            onClick: () => {
              navigate("/subscriber");
            },
          },
        });
      } else {
        toast.error(t.validation.toastError, {
          className: "bg-red-500/10 text-white font-semibold",
        });
      }
     

      console.error("error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return { onSubmit, form, isLoading, data };
}

export { useCreateQrcode };
