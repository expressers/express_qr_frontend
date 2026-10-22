export interface AppConfig {
  apiUrl: string;
  googleClientId: string;
}

// Em desenvolvimento usa a API local; em produção VITE_API_URL é obrigatório
// (definido na Vercel). Sem ele o apiClient falha logo com uma mensagem clara.
const DEFAULT_API_URL = import.meta.env.DEV ? "http://localhost:8080" : "";
const DEFAULT_GOOGLE_CLIENT_ID =
  "821167179033-4tids9e4pc9pcg4h275r2nfgj6lt8ccl.apps.googleusercontent.com";

const trimTrailingSlash = (url: string): string => url.replace(/\/+$/, "");

const apiUrl = trimTrailingSlash(
  import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL,
);

// O client ID do Google é público. O client secret nunca pode estar no
// frontend: vai parar ao bundle servido a qualquer visitante.
const config: AppConfig = {
  apiUrl,
  googleClientId:
    import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || DEFAULT_GOOGLE_CLIENT_ID,
};

export function getImageUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${config.apiUrl}${url}`;
}

export { config };
