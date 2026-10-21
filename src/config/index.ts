export interface AppConfig {
  apiUrl: string;
  googleClientId: string;
  googleClientSecret: string;
}

const prodApiUrl = "https://api-qr.bisc8.digital";
//const devApiUrl = "http://localhost:8080";
const devApiUrl = "https://api-qr.bisc8.digital";
const resolveApiUrl = (): string => {
  if (typeof window === "undefined") {
    return prodApiUrl;
  }

  const { hostname } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return devApiUrl;
  }

  return prodApiUrl;
};

const config: AppConfig = {
  apiUrl: resolveApiUrl(),
  googleClientId:
    "821167179033-4tids9e4pc9pcg4h275r2nfgj6lt8ccl.apps.googleusercontent.com",
  googleClientSecret: "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",
};

export function getImageUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${prodApiUrl}${url}`;
}

export { config };
