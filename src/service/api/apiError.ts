export type ApiErrorDetails = Record<string, unknown>;

/** Corpo de erro normalizado da API: `{ success:false, error:{ code, message, status, details } }`. */
export interface ApiErrorResponse {
  code?: string;
  message?: string;
  status?: number;
  details?: ApiErrorDetails;
}

/** Erro lançado pelo `apiClient` em qualquer resposta não-2xx. */
export class ApiError extends Error {
  status: number;
  code: string;
  details: ApiErrorDetails;

  constructor(
    message: string,
    status = 0,
    code = "UNKNOWN_ERROR",
    details: ApiErrorDetails = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
