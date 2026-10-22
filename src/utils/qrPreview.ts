import type { QrType } from "@/service/api/qrCodeService";

/** O backend gera slugs de 7 caracteres (5 bytes em base64url). */
export const PLACEHOLDER_SLUG = "Ab3dE5g";
const SAMPLE_CONTENT = "https://example.com";

export interface PreviewContent {
  content: string;
  /** `true` quando ainda não há nada escrito e o QR é só um exemplo. */
  sample: boolean;
}

/** Endereço curto de um QR dinâmico: o mesmo padrão que o backend grava no QR. */
export function shortUrl(slug: string, origin = window.location.origin): string {
  return `${origin}/r/${slug}`;
}

/**
 * O que a pré-visualização em direto desenha:
 * - dinâmico: o endereço curto (o real, se já há `slug`; senão um marcador do mesmo formato);
 * - estático: o texto que o utilizador escreve, ou um exemplo neutro enquanto estiver vazio.
 */
export function previewContent({
  type,
  draft,
  slug,
  origin,
}: {
  type: QrType;
  draft: string;
  slug?: string | null;
  origin?: string;
}): PreviewContent {
  if (type === "DYNAMIC") {
    return { content: shortUrl(slug || PLACEHOLDER_SLUG, origin), sample: false };
  }
  const text = draft.trim();
  return text ? { content: text, sample: false } : { content: SAMPLE_CONTENT, sample: true };
}
