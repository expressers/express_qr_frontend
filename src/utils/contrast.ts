/** Contraste mínimo WCAG AA para texto normal; o backend rejeita abaixo disto. */
export const MIN_CONTRAST = 4.5;

export const DEFAULT_QR_COLORS = { dark: "#000000", light: "#FFFFFF" } as const;

export interface QrColors {
  dark: string;
  light: string;
}

const HEX_FULL = /^#[0-9a-f]{6}$/i;
const HEX_SHORT = /^#[0-9a-f]{3}$/i;

/** `#RRGGBB` válido (formato exigido pelo backend). */
export function isHexColor(value: string): boolean {
  return HEX_FULL.test(value);
}

/**
 * Normaliza a escrita do utilizador para `#RRGGBB` em maiúsculas: aceita sem `#`
 * e a forma curta `#abc`. Devolve `null` se não for uma cor válida.
 */
export function normalizeHex(value: string): string | null {
  const raw = value.trim();
  const withHash = raw.startsWith("#") ? raw : `#${raw}`;
  if (HEX_FULL.test(withHash)) return withHash.toUpperCase();
  if (HEX_SHORT.test(withHash)) {
    const [, r, g, b] = withHash;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return null;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Luminância relativa WCAG 2.x (0 = preto, 1 = branco). */
export function relativeLuminance(hex: string): number {
  const normalized = normalizeHex(hex);
  if (!normalized) return 0;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Razão de contraste WCAG entre duas cores, de 1 a 21. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** O contraste chega para o QR ser aceite (>= 4,5:1). */
export function hasEnoughContrast(colors: QrColors): boolean {
  return (
    isHexColor(colors.dark) &&
    isHexColor(colors.light) &&
    contrastRatio(colors.dark, colors.light) >= MIN_CONTRAST
  );
}

export function sameColors(a: QrColors, b: QrColors): boolean {
  return (
    a.dark.toUpperCase() === b.dark.toUpperCase() &&
    a.light.toUpperCase() === b.light.toUpperCase()
  );
}
