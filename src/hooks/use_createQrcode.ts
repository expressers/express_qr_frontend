import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { qrCodeService, type QrCode } from "@/service/api";
import {
  applyFieldErrors,
  clearQrCaches,
  createQrFormSchema,
  DEFAULT_QR_COLORS,
  getErrorCode,
  getErrorMessage,
  hasEnoughContrast,
  parseTags,
  sameColors,
  type QrColors,
} from "@/utils";
import { useLang } from "./use_Lang";

interface UseCreateQrcodeOptions {
  /** Corre depois de cada tentativa (ex.: atualizar o uso do plano). */
  onSettled?: () => void;
  /** `features.customColors` do plano: sem ele as cores nunca vão no pedido. */
  canUseColors?: boolean;
}

function useCreateQrcode({ onSettled, canUseColors = false }: UseCreateQrcodeOptions = {}) {
  const navigate = useNavigate();
  const { translations } = useLang();
  const t = translations.components.CreateQrcode;
  const [data, setData] = useState<QrCode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colors, setColors] = useState<QrColors>({ ...DEFAULT_QR_COLORS });
  const colorsValid = hasEnoughContrast(colors);

  const schema = createQrFormSchema(
    {
      requiredTitle: t.validation.requiredTitle,
      minTitle: t.validation.minTitle,
      maxTitle: t.validation.maxTitle,
      maxDescription: t.validation.maxDescription,
      requiredContent: t.validation.requiredContent,
      contentTooLong: translations.errors.CONTENT_TOO_LONG,
      requiredUrl: t.validation.requiredUrl,
      invalidUrl: t.validation.invalidUrl,
    },
    t.validation.requiredType,
  );

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
    // O contraste também é validado no servidor; aqui evita-se o pedido falhado.
    if (canUseColors && !colorsValid) {
      toast.error(t.colors.blocked);
      return;
    }
    const tags = parseTags(value.tags);
    const payload = {
      type: value.type,
      title: value.title.trim(),
      ...(value.type === "STATIC"
        ? { staticContent: value.url.trim() }
        : { targetUrl: value.url.trim() }),
      ...(value.description?.trim() && { description: value.description.trim() }),
      ...(tags.length > 0 && { tags }),
      ...(canUseColors && !sameColors(colors, DEFAULT_QR_COLORS) && { design: colors }),
    };

    try {
      setIsLoading(true);
      const created = await qrCodeService.create(payload);
      setData(created);
      clearQrCaches();
      form.reset();
      toast.success(t.validation.toastSucces);
    } catch (error) {
      if (getErrorCode(error) === "PLAN_LIMIT_EXCEEDED") {
        toast.error(translations.errors.PLAN_LIMIT_EXCEEDED, {
          action: {
            label: t.validation.btnAction,
            onClick: () => navigate("/subscriber"),
          },
        });
      } else {
        applyFieldErrors(
          error,
          form.setError,
          {
            staticContent: "url",
            targetUrl: "url",
            title: "title",
            description: "description",
            tags: "tags",
            type: "type",
          },
          translations.errors.FIELD_INVALID,
        );
        toast.error(getErrorMessage(error, translations.errors, t.validation.toastError));
      }
    } finally {
      setIsLoading(false);
      onSettled?.();
    }
  }

  return { onSubmit, form, isLoading, data, colors, setColors, colorsValid };
}

export { useCreateQrcode };
