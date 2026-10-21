import apiClient from "./apiClient";

interface responseDataAnalytics {
  overview: {
    totalQrCodes: string;
    totalScans: number;
    staticQrCodes: number;
    dynamicQrCodes: number;
    recentQrCodes: number;
  };
  plan: {
    name: string;
    displayName: string;
    maxQrCodes: number;
  };
  detailedStats: {
    message: string;
    features: string[];
  };
}

interface responseStats {
  totalScans: number;
  message: string;
  featuares: string[];
}

interface responseDataQr {
  data: {
    qrCode: {
      id: string;
      slug: string;
      title: string;
      type: string;
      createdAt: string;
    };
  };
}

interface QrCodeAnalytics {
  data: responseDataQr;
  stats: responseStats;
}

interface responseAnalyticsProps {
  success: boolean;
  data: responseDataAnalytics;
}

export const AnalyticsService = {
  async getAnalytics() {
    return await apiClient.get<responseAnalyticsProps>(
      "/api/analytics/my-stats",
    );
  },

  async getQrCodeAnalytics(id: string) {
    return await apiClient.get<QrCodeAnalytics>(`/api/analytics/qr-code/${id}`);
  },
};
