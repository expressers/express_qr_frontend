import apiClient, { type BlobDownload } from "./apiClient";

export type QrType = "STATIC" | "DYNAMIC";
export type QrFormat = "png" | "svg" | "pdf";

export interface ApiEnvelope<T> {
  success: true;
  data: T;
}

export interface QrCode {
  id: string;
  type: QrType;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  slug: string | null;
  targetUrl: string | null;
  staticContent: string | null;
  isActive: boolean;
  imageUrl: string | null;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QrCodeList {
  qrcodes: QrCode[];
  total: number;
  take: number;
  skip: number;
}

export interface CreateQrCodeInput {
  type: QrType;
  targetUrl?: string;
  staticContent?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

export interface UpdateQrCodeInput {
  title?: string;
  description?: string;
  tags?: string[];
  targetUrl?: string;
  staticContent?: string;
  isActive?: boolean;
}

export interface PublicStaticQr {
  svg: string;
  dataUrl: string;
  format: "svg";
}

export const qrCodeService = {
  /** `isActive` filtra no servidor (omitido = todos). */
  async list(params: { skip?: number; take?: number; isActive?: boolean } = {}) {
    const response = await apiClient.get<ApiEnvelope<QrCodeList>>(
      "/api/qrcodes",
      params,
    );
    return response.data.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiEnvelope<{ qrcode: QrCode }>>(
      `/api/qrcodes/${encodeURIComponent(id)}`,
    );
    return response.data.data.qrcode;
  },

  async create(data: CreateQrCodeInput) {
    const response = await apiClient.post<ApiEnvelope<QrCode>>(
      "/api/qrcodes",
      { ...data },
    );
    return response.data.data;
  },

  async update(id: string, data: UpdateQrCodeInput) {
    const response = await apiClient.patch<ApiEnvelope<QrCode>>(
      `/api/qrcodes/${encodeURIComponent(id)}`,
      { ...data },
    );
    return response.data.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete<ApiEnvelope<{ id: string }>>(
      `/api/qrcodes/${encodeURIComponent(id)}`,
    );
    return response.data.data;
  },

  /** Geração anónima sem persistência: devolve o SVG inline e um data URL. */
  async generatePublicStatic(content: string) {
    const response = await apiClient.post<ApiEnvelope<PublicStaticQr>>(
      "/api/qrcodes/public/static",
      { content },
    );
    return response.data.data;
  },

  /** Download anónimo: o servidor gera o ficheiro a partir do conteúdo. */
  async downloadPublic(data: { content: string; format: QrFormat }): Promise<BlobDownload> {
    return apiClient.postBlob("/api/qrcodes/public/download", data);
  },

  /** Download autenticado de um QR do próprio utilizador. */
  async download(id: string, format: QrFormat): Promise<BlobDownload> {
    return apiClient.getBlob(
      `/api/qrcodes/${encodeURIComponent(id)}/download`,
      { format },
    );
  },
};
