import apiClient from "./apiClient";
import type { ApiEnvelope } from "./qrCodeService";

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserMe {
  id: string;
  displayName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  phone?: string;
  role?: string;
  emailVerified?: boolean;
  /** Permissões do papel (ex.: `user:read:any` para STAFF/ADMIN). */
  permissions?: string[];
}

/** Mantido por compatibilidade com quem importa `GetUserMe["data"]`. */
export type GetUserMe = ApiEnvelope<UserMe>;

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const userService = {
  async register(userData: RegisterInput) {
    const response = await apiClient.post<ApiEnvelope<{ user: UserMe }>>(
      "/api/users",
      { ...userData },
    );
    return response.data.data;
  },

  async getUserMe() {
    const response = await apiClient.get<GetUserMe>("/api/account/me");
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileInput) {
    const response = await apiClient.patch<ApiEnvelope<UserMe>>(
      "/api/account/me",
      { ...data },
    );
    return response.data.data;
  },

  /** Devolve um token novo: o servidor revoga todas as outras sessões. */
  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await apiClient.post<ApiEnvelope<{ message: string; token?: string }>>(
      "/api/account/change-password",
      data,
    );
    return response.data.data;
  },

  /** Envia um link de confirmação para o novo email; o email só muda ao confirmar. */
  async changeEmail(data: { newEmail: string; currentPassword: string }) {
    const response = await apiClient.post<ApiEnvelope<{ message?: string }>>(
      "/api/account/change-email",
      data,
    );
    return response.data.data;
  },

  /** Público: aplica o novo email com o token do link. Revoga as sessões. */
  async confirmEmail(token: string) {
    const response = await apiClient.post<ApiEnvelope<{ email: string }>>(
      "/api/account/confirm-email",
      { token },
    );
    return response.data.data;
  },

  async deleteAccount() {
    await apiClient.delete("/api/account/me");
  },
};
