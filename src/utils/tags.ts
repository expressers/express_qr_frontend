/** "a, b , ,c" → ["a","b","c"] (máx. 20, como o backend aceita). */
export function parseTags(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}
