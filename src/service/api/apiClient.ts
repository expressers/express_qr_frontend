import { config } from "../../config";

type ApiErrorDetails = Record<string, unknown>;
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> & {
  headers?: Record<string, string>;
  body?: BodyInit | Record<string, unknown> | FormData | URLSearchParams | null;
};

interface ApiErrorResponse {
  message?: string;
  status?: number;
  code?: string;
  details?: ApiErrorDetails;
}

class ApiError extends Error {
  status?: number;
  code?: string;
  details?: ApiErrorDetails;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: ApiErrorDetails,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = String(config.apiUrl ?? "");
    this.timeout = 120_000;

    if (!this.baseURL) {
      console.error("API URL não está definida no config");
      throw new Error("API URL não configurada");
    }
  }

  getAuthToken(): string | null {
    const token = localStorage.getItem("auth_token");
    const expiry = localStorage.getItem("auth_token_exp");

    if (expiry && Date.now() > parseInt(expiry, 10)) {
      this.clearAuthToken();
      return null;
    }

    return token;
  }

  clearAuthToken(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token_exp");
  }

  private createHeaders(
    customHeaders: Record<string, string> = {},
  ): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private createAbortController(): AbortController {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    controller.signal.addEventListener("abort", () => clearTimeout(timeoutId));

    return controller;
  }

  /*private async processResponse<T>(
    response: Response,
  ): Promise<{ data: T; status: number }> {
    if (!response.ok) {
      let errorData: ApiErrorResponse;

      try {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          errorData = (await response.json()) as ApiErrorResponse;
        } else {
          const textResponse = await response.text();
          errorData = {
            message: textResponse || `HTTP Error: ${response.status}`,
            status: response.status,
          };
        }
      } catch {
        errorData = {
          message: `HTTP Error: ${response.status} - ${response.statusText}`,
          status: response.status,
        };
      }

      let errorMessage = errorData.message || `HTTP Error: ${response.status}`;

      if (response.status === 403) {
        errorMessage =
          "Acesso negado. Você não tem permissão para esta operação.";
      } else if (response.status === 401) {
        errorMessage = "Não autorizado. Faça login novamente.";
      } else if (response.status === 404) {
        errorMessage = "Recurso não encontrado.";
      } else if (response.status === 500) {
        errorMessage = "Erro interno do servidor.";
      }

      const error = new ApiError(
        errorMessage,
        response.status,
        errorData.code,
        errorData.details,
      );

      if (response.status === 401) {
        this.clearAuthToken();
      }

      throw error;
    }

    try {
      const contentType = response.headers.get("content-type");
      const responseText = await response.text();

      let parsed: T;

      if (contentType && contentType.includes("application/json")) {
        if (!responseText.trim()) {
          parsed = {
            success: false,
            message: "Resposta vazia do servidor",
          } as T;
        } else {
          try {
            parsed = JSON.parse(responseText) as T;
          } catch (jsonError) {
            console.error("Erro ao fazer parse JSON:", jsonError);
            parsed = {
              success: false,
              message: "Resposta não é JSON válido",
            } as T;
          }
        }
      } else {
        parsed = {
          success: false,
          message: "Resposta não é JSON válido",
        } as T;
      }

      return { data: parsed, status: response.status };
    } catch (error) {
      console.error("Erro ao processar resposta completa:", error);
      throw new Error("Resposta inválida do servidor");
    }
  }*/

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<{ data: T; status: number }> {
    const controller = this.createAbortController();

    const headers = this.createHeaders(options.headers ?? {});

    let body: BodyInit | null | undefined = null;
    if (options.body === null) {
      body = null;
    } else if (
      typeof options.body === "string" ||
      options.body instanceof FormData ||
      options.body instanceof URLSearchParams ||
      options.body instanceof Blob ||
      options.body instanceof ArrayBuffer
    ) {
      body = options.body as BodyInit;
    } else if (typeof options.body === "object" && options.body !== undefined) {
      body = JSON.stringify(options.body as Record<string, unknown>);
    } else {
      body = undefined;
    }

    const config: RequestInit = {
      method: (options.method ?? "GET") as HttpMethod,
      headers,
      signal: controller.signal,
      credentials: options.credentials,
      cache: options.cache,
      redirect: options.redirect,
      referrer: options.referrer,
      referrerPolicy: options.referrerPolicy,
      integrity: options.integrity,
      keepalive: options.keepalive,
      mode: options.mode,
      window: options.window,
      body,
    };

    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, config);

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return { data, status: response.status };
  }
  
  async getBlob(
    endpoint: string,
    params: Record<string, string | number | boolean> = {},
  ): Promise<Blob> {
    const searchParams = new URLSearchParams(
      Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
        acc[k] = String(v);
        return acc;
      }, {}),
    );

    const url = searchParams.toString()
      ? `${endpoint}?${searchParams.toString()}`
      : endpoint;

    const controller = this.createAbortController();
    const headers = this.createHeaders();

    const response = await fetch(`${this.baseURL}${url}`, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(`HTTP Error: ${response.status}`, response.status);
    }

    return await response.blob();
  }

  async post<T = unknown>(
    endpoint: string,
    data: Record<string, unknown> | FormData | URLSearchParams = {},
  ): Promise<{ data: T; status: number }> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data,
    });
  }

  async get<T>(
    endpoint: string,
    params: Record<string, string | number | boolean> = {},
  ): Promise<{ data: T; status: number }> {
    const searchParams = new URLSearchParams(
      Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
        acc[k] = String(v);
        return acc;
      }, {}),
    );

    const url = searchParams.toString()
      ? `${endpoint}?${searchParams.toString()}`
      : endpoint;

    return this.request<T>(url, { method: "GET" });
  }

  async patch<T = unknown>(
    endpoint: string,
    data: Record<string, unknown> | FormData | URLSearchParams = {},
  ): Promise<{ data: T; status: number }> {
    return this.request<T>(endpoint, { method: "PATCH", body: data });
  }

  async put<T = unknown>(
    endpoint: string,
    data: Record<string, unknown> | FormData | URLSearchParams = {},
  ): Promise<{ data: T; status: number }> {
    return this.request<T>(endpoint, { method: "PUT", body: data });
  }

  async delete<T = unknown>(
    endpoint: string,
  ): Promise<{ data: T; status: number }> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

const apiClient = new ApiClient();

export default apiClient;
export { ApiError };
export type { ApiErrorDetails, ApiErrorResponse };
