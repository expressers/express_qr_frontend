import apiClient from "./apiClient";

interface userDataProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface responseRegisterProps {
  message: string;
  status: number;
  success: boolean;
  user: {
    id: string;
    email: string;
  };
}

interface dataUser {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface responseAllUser {
  success: boolean;
  data: dataUser[];
  pagination: {
    page: number;
    limit: number;
  };
}

interface dataUserPlan {
  userId: string;
  newPlan: string;
  planDetails: {
    name: string;
    displayName: string;
    maxQrCodes: number;
    price: number;
    features: {
      analytics: boolean;
      customColors: boolean;
    };
  };
}
interface responseUserPlan {
  success: boolean;
  message: string;
  data: dataUserPlan;
}

interface updateUserStatusResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    userId: string;
    newStatus: string;
  };
}

export interface GetUserMe {
  success: boolean;
  data: {
    id: string;
    displayName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    phone?: string;
    city?: string;
    country?: string;
    role?: string;
  };
}
interface UpdateUser {
  success: boolean;
  data: {
    displayName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    phone?: string;
    city?: string;
    country?: string;
  };
}
interface ChangePassword {
  success: boolean;
  data: {
    message: string;
  };
}

export const userService = {
  async register(userData: userDataProps) {
    return apiClient.post<responseRegisterProps>("/api/users", {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
    });
  },

  /* Api Admin */

  async getAllUser(param: {
    page?: number;
    limit?: number;
    plan?: string;
    satus?: string;
  }) {
    const defaultParams = {
      page: 1,
      limit: 50,
    };

    return await apiClient.get<responseAllUser>("/api/admin/users", {
      ...param,
      ...defaultParams,
    });
  },

  async getUserPlan(id: string) {
    return await apiClient.patch<responseUserPlan>(
      `/api/admin/users/:${id}/plan`,
    );
  },

  async updateUserStatus(userId: string) {
    return await apiClient.patch<updateUserStatusResponse>(
      `/api/admin/users/:${userId}/status`,
    );
  },

  async getUserMe() {
    return await apiClient.get<GetUserMe>("/api/account/me");
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    photo?: string;
    phone?: string;
    city?: string;
    country?: string;
    email?: string;
  }) {
    return await apiClient.patch<UpdateUser>("/api/account/me", data);
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return apiClient.post<ChangePassword>("/api/account/change-password", data);
  },

  async DeleteAccount() {
    return await apiClient.delete("/api/account/me");
  },
};
