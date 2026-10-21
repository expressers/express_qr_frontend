import apiClient from "./apiClient";

export interface QrCode {
  id: string;
  slug: string;
  type: "STATIC" | "DYNAMIC";
  status: "ACTIVE" | "INACTIVE";
  targetUrl?: string;
  staticContent?: string;
  title: string;
  description?: string | null;
  tags?: string[];
  imageUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  currentLimit?: number;
  currentPlan?: string;
  currentUsage?: number;
  message?: string;
}

export interface ListQrCodesResponse {
  success: boolean;
  
  data: {
   qrcodes:QrCode[]
  };
}

export interface CreateQrCodeResponse {
  success: boolean;
  status: number;
  data: QrCode;
}

export interface PlanLimitErrorResponse {
  message: string;
  currentPlan: string;
  currentLimit: number;
  currentUsage: number;
  upgradeOptions: {
    name: string;
    displayName: string;
    maxQrCodes: number;
    price: number;
  }[];
}

export interface UpdateQrCodeResponse {
  success: boolean;
  status:number,
  data: QrCode;
}

export interface GererateQRcodeStaticProps {
  success: boolean;
  status: number;
  data: {
    success: boolean;
    imageUrl: string;
    id: string;
    message?: string;
    
  };
}

export const qrCodeService = {
  async list(params?: { skip?: number; take?: number }) {
    const response = await apiClient.get<ListQrCodesResponse>(
      "/api/qrcodes",
      params ?? {},
    );
   
    return response
  },

  async create(data: {
    type: "STATIC" | "DYNAMIC";
    targetUrl?: string;
    staticContent?: string;
    title: string;
    description?: string;
    tags?: string[];
  }) {
    return await apiClient.post<CreateQrCodeResponse>("/api/qrcodes", data);
  },

  async update(id: string, data: Partial<Omit<QrCode, "id" | "ownerId">>) {
    const response = await apiClient.patch<UpdateQrCodeResponse>(
      `/api/qrcodes/${id}`,
      data,
    );

    

    return response
  },

  async getImageUrl(id: string) {
    const response = await apiClient.get(`/api/qrcodes/${id}/image`);

    return response.data;
  },

  async gererateQRcodeStatic(data: {
    content: string;
    format?: "svg" | "png" | "pdf";
  }) {
    const response = await apiClient.post<GererateQRcodeStaticProps>(
      "/api/qrcodes/public/static",
      data,
    );

  
    return response;
  },

  async getQrDownload(data: { id: string; format: string }) {
   
    const response = await apiClient.getBlob(
      `/api/qrcodes/public/${data.id}/download`,
      {
        format: data.format,
      },
    );
    
    return response;
  },
};
