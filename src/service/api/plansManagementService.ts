import apiClient from "./apiClient";

export interface PlanFeatures {
  basicQrGeneration?: boolean;
  customColors?: boolean;
  customLogo?: boolean;
  analytics?: boolean;
  apiAccess?: boolean;
  teamCollaboration?: boolean;
  prioritySupport?: boolean;
}

export interface PlanInfo {
  name: string;
  displayName: string;
  maxQrCodes: {
    STATIC: number;
    DYNAMIC: number;
    TOTAL: number;
  };
  price: number;
  features: PlanFeatures;
}

export interface PlanUsage {
  currentQrCount: number;
  remainingQrCodes: number;
  static?: {
    current: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
  dynamic?: {
    current: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
  total?: {
    current: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
}

export interface PlanData {
  currentPlan: PlanInfo;
  usage: PlanUsage;
  upgradeOptions: PlanInfo[];
  subscription: {
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string
  };
}

export interface PlanMeResponse {
  success: boolean;
  data: PlanData;
}


export interface PlansResponse {
  success: boolean;
  data: {
    plans: PlanInfo[];
  };
  status: number;
}

interface CheckFeatureResponse {
  success: boolean;
  data: {
    feature: string;
    hasAccess: boolean;
    currentPlan: string;
    message: string;
  };
}


export const plansManagementService = {
  async getPlans() {
    return await apiClient.get<PlansResponse>("/api/plans");
  },

  async getPlanMe() {
    return await apiClient.get<PlanMeResponse>("/api/plans/my-plan");
  },

  async checkFeature(feature: string) {
    return await apiClient.get<CheckFeatureResponse>(
      `/api/plans/check-feature/${feature}`,
    );
  },
};
