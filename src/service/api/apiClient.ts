import { config } from "../../config";
import { clearSession } from "@/utils/session";
import {
  ApiError,
  type ApiErrorDetails,
  type ApiErrorResponse,
} from "./apiError";
import { parseContentDispositionFilename } from "./contentDisposition";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type QueryParams = Record<string, string | number | boolean | undefined>;
type JsonBody = Record<string, unknown> | FormData | URLSearchParams;

/** `reason` mostra no login a mensagem "a sessão terminou" (revogação, expiração). */
const SIGNIN_PATH = "/auth/signin?reason=session-ended";
/** Páginas onde um 401 não deve provocar redirecionamento (evita ciclos). */
const AUTH_PAGE_PREFIXES = [
  "/auth/",
  "/reset-password",
  "/verify-email",
  "/confirm-email",
];
/** Área que exige sessão: um token expirado localmente aqui manda para o login. */
const PRIVATE_PATH_PREFIX = "/dashboard";

/** Ficheiro descarregado + nome sugerido pelo servidor (Content-Disposition). */
export interface BlobDownload {
  blob: Blob;
  filename: string | null;
}

/** `true` se o token guardado tem `exp` no passado. */
function isStoredTokenExpired(): boolean {
  const expiry = localStorage.getItem("auth_token_exp");
  if (!expiry) return false;
  const expMs = Number(expiry);
  return Number.isNaN(expMs) || Date.now() > expMs;
}

function isPrivatePath(): boolean {
  return (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith(PRIVATE_PATH_PREFIX)
  );
}

async function toBlobDownload(response: Response): Promise<BlobDownload> {
  return {
    blob: await response.blob(),
    filename: parseContentDispositionFilename(
      response.headers.get("content-disposition"),
    ),
  };
}

function buildQuery(endpoint: string, params: QueryParams = {}): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `${endpoint}?${query}` : endpoint;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = String(config.apiUrl ?? "");
    this.timeout = 120_000;

    if (!this.baseURL) {
      throw new Error("API URL não configurada");
    }
  }

  /** Token guardado, ou `null`. Um token expirado localmente limpa a sessão inteira. */
  getAuthToken(): string | null {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    if (isStoredTokenExpired()) {
      clearSession();
      return null;
    }

    return token;
  }

  private createHeaders(
    customHeaders: Record<string, string> = {},
  ): { headers: Record<string, string>; hasToken: boolean } {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return { headers, hasToken: Boolean(token) };
  }

  /**
   * Corre `fn` com um `AbortSignal` que dispara ao fim de `this.timeout`.
   * O temporizador é sempre limpo no fim (sucesso, erro ou leitura do corpo).
   */
  private async withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    try {
      return await fn(controller.signal);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /** Sessão inválida: limpa tudo e volta ao login (excepto nas páginas de auth). */
  private handleUnauthorized(): void {
    clearSession();
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    if (AUTH_PAGE_PREFIXES.some((prefix) => path.startsWith(prefix))) return;
    window.location.assign(SIGNIN_PATH);
  }

  /** Converte uma resposta não-2xx num `ApiError` a partir do envelope. */
  private async toApiError(response: Response): Promise<ApiError> {
    let payload: unknown = null;
    try {
      const contentType = response.headers.get("content-type") ?? "";
      payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch {
      payload = null;
    }

    let body: ApiErrorResponse = {};
    if (payload && typeof payload === "object") {
      const envelope = payload as {
        error?: ApiErrorResponse | string;
        message?: string;
        code?: string;
        details?: ApiErrorDetails;
      };
      if (envelope.error && typeof envelope.error === "object") {
        body = envelope.error;
      } else {
        // Formatos antigos: `{ message }` ou `{ error: "texto" }`.
        body = {
          message:
            envelope.message ??
            (typeof envelope.error === "string" ? envelope.error : undefined),
          code: envelope.code,
          details: envelope.details,
        };
      }
    } else if (typeof payload === "string" && payload.trim()) {
      body = { message: payload };
    }

    return new ApiError(
      body.message || `HTTP ${response.status}`,
      body.status ?? response.status,
      body.code || `HTTP_${response.status}`,
      body.details ?? {},
    );
  }

  private async send(
    method: HttpMethod,
    endpoint: string,
    signal: AbortSignal,
    body?: JsonBody,
    accept = "application/json",
  ): Promise<Response> {
    // Token expirado localmente: na área privada não vale a pena ir ao
    // servidor; nas páginas públicas o pedido segue anónimo.
    if (localStorage.getItem("auth_token") && isStoredTokenExpired()) {
      clearSession();
      if (isPrivatePath()) {
        this.handleUnauthorized();
        throw new ApiError("Sessão expirada", 401, "UNAUTHORIZED");
      }
    }

    const { headers, hasToken } = this.createHeaders({ Accept: accept });

    let requestBody: BodyInit | undefined;
    if (body instanceof FormData || body instanceof URLSearchParams) {
      requestBody = body;
      if (body instanceof FormData) delete headers["Content-Type"];
    } else if (body !== undefined) {
      requestBody = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers,
      signal,
      body: requestBody,
    });

    if (!response.ok) {
      const error = await this.toApiError(response);
      // Só `UNAUTHORIZED` invalida a sessão: outros 401 (ex.: credenciais
      // erradas no login) são erros normais do formulário.
      if (response.status === 401 && error.code === "UNAUTHORIZED" && hasToken) {
        this.handleUnauthorized();
      }
      throw error;
    }

    return response;
  }

  private request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: JsonBody,
  ): Promise<{ data: T; status: number }> {
    return this.withTimeout(async (signal) => {
      const response = await this.send(method, endpoint, signal, body);

      const contentType = response.headers.get("content-type") ?? "";
      const text = await response.text();
      const data = (
        contentType.includes("application/json") && text.trim()
          ? JSON.parse(text)
          : text
      ) as T;

      return { data, status: response.status };
    });
  }

  async get<T>(
    endpoint: string,
    params: QueryParams = {},
  ): Promise<{ data: T; status: number }> {
    return this.request<T>("GET", buildQuery(endpoint, params));
  }

  async post<T = unknown>(
    endpoint: string,
    data: JsonBody = {},
  ): Promise<{ data: T; status: number }> {
    return this.request<T>("POST", endpoint, data);
  }

  async patch<T = unknown>(
    endpoint: string,
    data: JsonBody = {},
  ): Promise<{ data: T; status: number }> {
    return this.request<T>("PATCH", endpoint, data);
  }

  async put<T = unknown>(
    endpoint: string,
    data: JsonBody = {},
  ): Promise<{ data: T; status: number }> {
    return this.request<T>("PUT", endpoint, data);
  }

  async delete<T = unknown>(
    endpoint: string,
  ): Promise<{ data: T; status: number }> {
    return this.request<T>("DELETE", endpoint);
  }

  /** GET que devolve um ficheiro binário (download autenticado). */
  getBlob(endpoint: string, params: QueryParams = {}): Promise<BlobDownload> {
    return this.withTimeout(async (signal) => {
      const response = await this.send(
        "GET",
        buildQuery(endpoint, params),
        signal,
        undefined,
        "*/*",
      );
      return toBlobDownload(response);
    });
  }

  /** POST com corpo JSON que devolve um ficheiro binário (download anónimo). */
  postBlob(endpoint: string, data: JsonBody = {}): Promise<BlobDownload> {
    return this.withTimeout(async (signal) => {
      const response = await this.send("POST", endpoint, signal, data, "*/*");
      return toBlobDownload(response);
    });
  }
}

const apiClient = new ApiClient();

export default apiClient;
export { ApiError };
export type { ApiErrorDetails, ApiErrorResponse };
