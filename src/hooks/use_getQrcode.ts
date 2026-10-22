import { useCallback, useEffect, useState } from "react";
import { qrCodeService, type QrCode } from "@/service/api";
import { useLatestRequest } from "./use_latestRequest";

/** Carrega um QR do utilizador por id (GET /api/qrcodes/:id). */
function useGetQrcode(id: string | undefined) {
  const [data, setData] = useState<QrCode | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<unknown>(null);
  const { start, isCurrent } = useLatestRequest();

  const fetchQrcode = useCallback(async () => {
    const requestId = start();
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const result = await qrCodeService.getById(id);
      if (isCurrent(requestId)) setData(result);
    } catch (err) {
      if (!isCurrent(requestId)) return;
      setError(err);
      setData(null);
    } finally {
      if (isCurrent(requestId)) setIsLoading(false);
    }
  }, [id, start, isCurrent]);

  useEffect(() => {
    fetchQrcode();
  }, [fetchQrcode]);

  return { data, isLoading, error, refetch: fetchQrcode };
}

export { useGetQrcode };
