import apiClient from "./apiClient";
import type { ApiEnvelope } from "./qrCodeService";

export type PlanName = "FREE" | "PRO" | "PREMIUM" | "INTERNAL";

export interface PlanFeatures {
  customColors?: boolean;
  analytics?: "basic" | "full";
  [feature: string]: unknown;
}

export interface Plan {
  name: PlanName;
  /** "Free" | "Pro" | "Premium" (ou "Equipa ExpressQR" para INTERNAL). */
  displayName: string;
  /** -1 = ilimitado. */
  maxQrCodes: { STATIC: number; DYNAMIC: number };
  features: PlanFeatures;
  analyticsWindowDays: number;
}

export interface PlanUsage {
  static: number;
  dynamic: number;
}

export interface Subscription {
  currentPeriodEnd: string | null;
  status: string;
}

export interface MyPlan {
  plan: Plan;
  usage: PlanUsage;
  /** -1 = ilimitado. */
  remaining: PlanUsage;
  subscription: Subscription | null;
}

export const plansManagementService = {
  async getPlans() {
    const response =
      await apiClient.get<ApiEnvelope<{ plans: Plan[] }>>("/api/plans");
    return response.data.data.plans;
  },

  async getMyPlan() {
    const response =
      await apiClient.get<ApiEnvelope<MyPlan>>("/api/plans/my-plan");
    return response.data.data;
  },
};
