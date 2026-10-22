import { z } from "zod";
import { isHttpUrl } from "./safeUrl";

/** Limites iguais aos do backend (validators/qrcodes.schemas.ts). */
export const QR_LIMITS = {
  titleMin: 3,
  titleMax: 120,
  descriptionMax: 500,
  staticContentMax: 2000,
} as const;

export interface QrSchemaMessages {
  requiredTitle: string;
  minTitle: string;
  maxTitle: string;
  maxDescription: string;
  requiredContent: string;
  contentTooLong: string;
  requiredUrl: string;
  invalidUrl: string;
}

/** Título obrigatório (3..120), igual na criação e na edição. */
export function qrTitleSchema(m: QrSchemaMessages) {
  return z
    .string()
    .trim()
    .min(1, m.requiredTitle)
    .min(QR_LIMITS.titleMin, m.minTitle)
    .max(QR_LIMITS.titleMax, m.maxTitle);
}

export function qrDescriptionSchema(m: QrSchemaMessages) {
  return z.string().max(QR_LIMITS.descriptionMax, m.maxDescription).optional();
}

/** Conteúdo estático: qualquer texto 1..2000. */
export function qrStaticContentSchema(m: QrSchemaMessages) {
  return z
    .string()
    .trim()
    .min(1, m.requiredContent)
    .max(QR_LIMITS.staticContentMax, m.contentTooLong);
}

/** Destino dinâmico: só URLs http(s) absolutos. */
export function qrTargetUrlSchema(m: QrSchemaMessages) {
  return z
    .string()
    .trim()
    .min(1, m.requiredUrl)
    .refine(isHttpUrl, m.invalidUrl);
}

/** Conteúdo de acordo com o tipo do QR. */
export function qrContentSchema(type: "STATIC" | "DYNAMIC", m: QrSchemaMessages) {
  return type === "DYNAMIC" ? qrTargetUrlSchema(m) : qrStaticContentSchema(m);
}

/**
 * Formulário de criação: o mesmo campo `url` serve de conteúdo estático ou de
 * destino dinâmico, validado conforme o `type` escolhido.
 */
export function createQrFormSchema(m: QrSchemaMessages, requiredType: string) {
  return z
    .object({
      url: z.string(),
      title: qrTitleSchema(m),
      description: qrDescriptionSchema(m),
      tags: z.string().optional(),
      type: z.enum(["STATIC", "DYNAMIC"], { message: requiredType }),
    })
    .superRefine((value, ctx) => {
      const result = qrContentSchema(value.type, m).safeParse(value.url);
      if (!result.success) {
        ctx.addIssue({
          code: "custom",
          path: ["url"],
          message: result.error.issues[0]?.message ?? m.invalidUrl,
        });
      }
    });
}

/** Formulário de edição: o tipo é fixo, por isso o conteúdo valida-se directamente. */
export function editQrFormSchema(type: "STATIC" | "DYNAMIC", m: QrSchemaMessages) {
  return z.object({
    content: qrContentSchema(type, m),
    title: qrTitleSchema(m),
    tags: z.string().optional(),
    description: qrDescriptionSchema(m),
    isActive: z.boolean(),
  });
}
