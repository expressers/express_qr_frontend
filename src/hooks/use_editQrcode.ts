import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { qrCodeService, type QrCode, type UpdateQrCodeInput } from "@/service/api";
import {
  applyFieldErrors,
  clearQrCaches,
  DEFAULT_QR_COLORS,
  editQrFormSchema,
  getErrorMessage,
  hasEnoughContrast,
  parseTags,
  sameColors,
  type QrColors,
} from "@/utils";
import { useLang } from "./use_Lang";

/**
 * Edição de um QR guardado. O tipo não muda: DYNAMIC envia `targetUrl`,
 * STATIC envia `staticContent`. `isActive` desativa o redirecionamento.
 */
function useEditQrcode(qrcode: QrCode, { canUseColors = false }: { canUseColors?: boolean } = {}) {
  const { translations } = useLang();
  const t = translations.pages.QrcodeEdit;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const isDynamic = qrcode.type === "DYNAMIC";
  const savedColors: QrColors = qrcode.design ?? { ...DEFAULT_QR_COLORS };
  const [colors, setColors] = useState<QrColors>(savedColors);
  const colorsValid = hasEnoughContrast(colors);
  const colorsChanged = !sameColors(colors, savedColors);

  const schema = editQrFormSchema(qrcode.type, {
    requiredTitle: t.validation.requiredTitle,
    minTitle: t.validation.minTitle,
    maxTitle: t.validation.maxTitle,
    maxDescription: t.validation.maxDescription,
    requiredContent: t.validation.requiredContent,
    contentTooLong: translations.errors.CONTENT_TOO_LONG,
    requiredUrl: t.validation.requiredLink,
    invalidUrl: t.validation.invalidLink,
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: (isDynamic ? qrcode.targetUrl : qrcode.staticContent) ?? "",
      title: qrcode.title ?? "",
      tags: Array.isArray(qrcode.tags) ? qrcode.tags.join(", ") : "",
      description: qrcode.description ?? "",
      isActive: qrcode.isActive ?? true,
    },
  });

  async function onSubmit(value: FormValues) {
    if (canUseColors && colorsChanged && !colorsValid) {
      toast.error(translations.components.CreateQrcode.colors.blocked);
      return;
    }
    const payload: UpdateQrCodeInput = {
      title: value.title,
      description: value.description?.trim() ?? "",
      tags: parseTags(value.tags),
      isActive: value.isActive,
      ...(isDynamic
        ? { targetUrl: value.content }
        : { staticContent: value.content }),
      ...(canUseColors && colorsChanged && { design: colors }),
    };

    try {
      setIsLoading(true);
      await qrCodeService.update(qrcode.id, payload);
      clearQrCaches();
      toast.success(t.toastSuccess);
      navigate("/dashboard/my-qrcodes");
    } catch (error) {
      applyFieldErrors(
        error,
        form.setError,
        {
          staticContent: "content",
          targetUrl: "content",
          title: "title",
          description: "description",
          tags: "tags",
        },
        translations.errors.FIELD_INVALID,
      );
      toast.error(getErrorMessage(error, translations.errors, t.toastError));
    } finally {
      setIsLoading(false);
    }
  }

  return { form, onSubmit, isLoading, isDynamic, colors, setColors, colorsValid, colorsChanged };
}

export { useEditQrcode };
