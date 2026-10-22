/**
 * Nome do ficheiro em `Content-Disposition` (`filename*=UTF-8''…` ou `filename="…"`).
 * Só o nome base: barras e caracteres de controlo são descartados.
 */
export function parseContentDispositionFilename(header: string | null): string | null {
  if (!header) return null;
  let name: string | null = null;
  const star = /filename\*\s*=\s*(?:UTF-8|utf-8)''([^;]+)/.exec(header);
  if (star) {
    try {
      name = decodeURIComponent(star[1].trim().replace(/^"|"$/g, ""));
    } catch {
      name = null;
    }
  }
  if (!name) {
    const plain = /filename\s*=\s*("([^"]*)"|[^;]+)/i.exec(header);
    name = plain ? (plain[2] ?? plain[1]).trim() : null;
  }
  if (!name) return null;
  // eslint-disable-next-line no-control-regex
  const safe = name.replace(/[\\/\u0000-\u001f]/g, "").trim();
  return safe || null;
}
