import { jwtDecode } from "jwt-decode";
import { clearSession } from "@/utils/session";
import apiClient from "./apiClient";
import type { ApiEnvelope } from "./qrCodeService";

interface CredentialsProps {
  email: string;
  password: string;
}

type SessionResponse = ApiEnvelope<{ accessToken: string }>;
type MessageResponse = ApiEnvelope<{ message?: string }>;

export const authService = {
  async login(credentials: CredentialsProps) {
    // Nunca misturar dados da conta anterior com a nova sessão.
    clearSession();
    const response = await apiClient.post<SessionResponse>("/api/sessions", {
      email: credentials.email,
      password: credentials.password,
    });
    this.storeToken(response.data.data.accessToken);
    return response.data.data;
  },

  /** Troca o access token da Google por uma sessão da API (validado no servidor). */
  async loginWithGoogle(googleAccessToken: string) {
    clearSession();
    const response = await apiClient.post<SessionResponse>(
      "/api/sessions/google",
      { accessToken: googleAccessToken },
    );
    this.storeToken(response.data.data.accessToken);
    return response.data.data;
  },

  storeToken(token: string | undefined) {
    if (!token) return;
    localStorage.setItem("auth_token", token);
    try {
      const { exp } = jwtDecode<{ exp?: number }>(token);
      if (exp) localStorage.setItem("auth_token_exp", String(exp * 1000));
      else localStorage.removeItem("auth_token_exp");
    } catch {
      localStorage.removeItem("auth_token_exp");
    }
  },

  /** Remove token, utilizador e caches da conta. */
  logout() {
    clearSession();
  },

  async forgotPassword(credentials: { email: string }) {
    const response = await apiClient.post<MessageResponse>(
      "/api/sessions/forgot-password",
      { email: credentials.email },
    );
    return response.data.data;
  },

  async resetPassword(credentials: { token: string; newPassword: string }) {
    const response = await apiClient.post<MessageResponse>(
      "/api/sessions/reset-password",
      { token: credentials.token, newPassword: credentials.newPassword },
    );
    return response.data.data;
  },

  /** Público e com resposta neutra: devolve sempre 200 (salvo rate limit). */
  async resendVerification(email: string) {
    const response = await apiClient.post<MessageResponse>(
      "/api/auth/resend-verification",
      { email },
    );
    return response.data.data;
  },

  isAuthenticated() {
    return !!apiClient.getAuthToken();
  },

  getToken() {
    return apiClient.getAuthToken();
  },

  async verifyEmail(token: string) {
    const response = await apiClient.get<MessageResponse>("/api/auth/verify", {
      token,
    });
    return response.data.data;
  },
};
