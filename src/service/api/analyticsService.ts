import apiClient from "./apiClient";
import type { ApiEnvelope, QrType } from "./qrCodeService";
import type { PlanName } from "./plansManagementService";

/** Ponto diário da série (UTC, YYYY-MM-DD). */
export interface DailyPoint {
  date: string;
  scans: number;
}

export interface FieldCount {
  value: string;
  count: number;
}

export interface AnalyticsWindow {
  days: number;
  from: string;
  to: string;
}

/** Só presente nos planos com analytics completa (Pro/Premium). */
export interface AnalyticsBreakdown {
  byCountry: FieldCount[];
  byCity: FieldCount[];
  byDevice: FieldCount[];
  byReferrer: FieldCount[];
}

export interface MyStats {
  overview: {
    totalQrCodes: number;
    totalScans: number;
    scansInWindow: number;
    scansLast24h: number;
    staticQrCodes: number;
    dynamicQrCodes: number;
    recentQrCodes: number;
  };
  plan: {
    name: PlanName;
    displayName: string;
    maxQrCodes?: { STATIC: number; DYNAMIC: number };
    unlimited: boolean;
    isInternal: boolean;
  };
  window: AnalyticsWindow;
  series: DailyPoint[];
  breakdown?: AnalyticsBreakdown;
  topQrCodes?: {
    id: string;
    title: string;
    type: QrType | null;
    slug: string | null;
    scans: number;
  }[];
}

export interface QrCodeStats {
  qrCode: {
    id: string;
    slug: string | null;
    title: string | null;
    type: QrType;
    targetUrl: string | null;
    createdAt: string;
  };
  window: AnalyticsWindow;
  stats: {
    totalScans: number;
    scansInWindow: number;
    scansLast24h: number;
  };
  series: DailyPoint[];
  breakdown?: AnalyticsBreakdown;
}

export const analyticsService = {
  async getMyStats(days?: number) {
    const response = await apiClient.get<ApiEnvelope<MyStats>>(
      "/api/analytics/my-stats",
      { days },
    );
    return response.data.data;
  },

  async getQrCodeStats(id: string, days?: number) {
    const response = await apiClient.get<ApiEnvelope<QrCodeStats>>(
      `/api/analytics/qr-code/${encodeURIComponent(id)}`,
      { days },
    );
    return response.data.data;
  },
};
