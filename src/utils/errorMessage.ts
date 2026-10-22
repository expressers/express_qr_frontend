import { isApiError } from "@/service/api/apiError";

/**
 * Mensagem para o utilizador a partir de um erro da API.
 * Ordem: tradução do `code` → `RATE_LIMITED` para 429 → `fallback` traduzido.
 * A mensagem crua do servidor nunca é mostrada (pode vir noutra língua ou
 * expor detalhes internos).
 */
export function getErrorMessage(
  error: unknown,
  errors: Record<string, string>,
  fallback: string,
): string {
  if (isApiError(error)) {
    const translated = errors[error.code];
    if (translated) return translated;
    if (error.status === 429 && errors.RATE_LIMITED) return errors.RATE_LIMITED;
    return fallback;
  }
  if (error instanceof TypeError || (error as Error)?.name === "AbortError") {
    return errors.NETWORK_ERROR ?? fallback;
  }
  return fallback;
}

/** Código do erro da API, ou `undefined` para erros de rede/cliente. */
export function getErrorCode(error: unknown): string | undefined {
  return isApiError(error) ? error.code : undefined;
}

/**
 * Campos inválidos de um `VALIDATION_ERROR` (`details.fields: { campo: string[] }`).
 * Devolve só os nomes dos campos da API com erro; vazio se não houver.
 */
export function getFieldErrors(error: unknown): string[] {
  if (!isApiError(error) || error.code !== "VALIDATION_ERROR") return [];
  const fields = error.details?.fields;
  if (!fields || typeof fields !== "object") return [];
  return Object.entries(fields as Record<string, unknown>)
    .filter(([, messages]) => Array.isArray(messages) && messages.length > 0)
    .map(([field]) => field);
}

/**
 * Marca no formulário os campos rejeitados pelo servidor.
 * `fieldMap` traduz o nome do campo da API para o do formulário (ex.:
 * `targetUrl` → `url`); `message` é o texto traduzido a mostrar.
 * Devolve `true` se marcou algum campo.
 */
export function applyFieldErrors<TField extends string>(
  error: unknown,
  setError: (name: TField, error: { type: string; message: string }) => void,
  fieldMap: Partial<Record<string, TField>>,
  message: string,
): boolean {
  let applied = false;
  for (const field of getFieldErrors(error)) {
    const name = fieldMap[field];
    if (!name) continue;
    setError(name, { type: "server", message });
    applied = true;
  }
  return applied;
}
