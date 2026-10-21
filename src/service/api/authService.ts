import apiClient from "./apiClient.js";

interface CredentialsProps {
  email: string;
  password: string;
}
interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  username?: string;
  email?: string;
  photo?: string;
  role?: string;
  phone?: string;
  city?: string;
  country?: string;
}
interface ResponseProps {
  token?: string;
  message?: string;
  success?: boolean;
  user: User;
  data: {
    accessToken?: string;
    token?: string;
    user?: User;
    success?: boolean;
  };
}

interface VerifyEmail {
  message: string;
  success: string;
  data: {
    message: string;
    success: string;
  };
}

export const authService = {
  async login(credentials: CredentialsProps) {
    const response = await apiClient.post<ResponseProps>("/api/sessions", {
      email: credentials.email,
      password: credentials.password,
    });

    if (response.status === 200) {
      const accessToken = response.data.data.accessToken || response.data.token;

      if (accessToken) {
        this.storeToken(accessToken);
      }
    }

    return response;
  },

  storeToken(token: string) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expMs = payload?.exp ? payload.exp * 1000 : null;

      localStorage.setItem("auth_token", token);
      if (expMs) {
        localStorage.setItem("auth_token_exp", String(expMs));
      }
    } catch {
      localStorage.setItem("auth_token", token);
    }
  },

  logout() {
    apiClient.clearAuthToken();
  },

  async forgotPassword(credentials: { email: string }) {
    const response = await apiClient.post<ResponseProps>(
      "/api/sessions/forgot-password",
      { email: credentials.email },
    );
    return response;
  },
  async resetPassword(credentials: { newPassword:string }) {
    const response = await apiClient.post<ResponseProps>(
      "/api/sessions/reset-password",
      { newPassword: credentials.newPassword },
    );
    return response;
  },

  isAuthenticated() {
    return !!apiClient.getAuthToken();
  },

  getToken() {
    return apiClient.getAuthToken();
  },

  async verifyEmail(token: string) {
    const response = await apiClient.get<VerifyEmail>("/api/auth/verify", {
      token,
    });

    return response.data;
  },
};
