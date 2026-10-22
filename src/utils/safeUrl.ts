/** `true` só para URLs absolutos `http:` ou `https:` (rejeita `javascript:`, `data:`, …). */
export function isHttpUrl(value: string): boolean {
  return getSafeRedirectUrl(value) !== null;
}

/**
 * URL normalizado se for um destino http(s) válido; caso contrário `null`.
 * Usado pela página de redirecionamento antes de navegar.
 */
export function getSafeRedirectUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.href;
}
