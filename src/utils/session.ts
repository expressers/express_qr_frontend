import { CACHE } from "./cache";

/** Chaves de localStorage que pertencem à sessão do utilizador atual. */
const SESSION_KEYS = ["auth_token", "auth_token_exp", "user", "user_me"];

/** Prefixos de cache com dados da conta (listas de QR por página, etc.). */
const SESSION_CACHE_PREFIXES = ["qrcodes"];

/**
 * Remove o token e todos os dados em cache da conta atual.
 * Evita que o utilizador seguinte no mesmo browser veja dados da conta anterior.
 */
export function clearSession(): void {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  SESSION_CACHE_PREFIXES.forEach((prefix) => CACHE.clearByPrefix(prefix));
}

/** Limpa apenas as caches de QR (após criar, editar ou apagar). */
export function clearQrCaches(): void {
  CACHE.clearByPrefix("qrcodes");
}
