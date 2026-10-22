import { useCallback, useEffect, useState } from "react";
import {
  analyticsService,
  type MyStats,
  type QrCodeStats,
} from "@/service/api";
import { useLatestRequest } from "./use_latestRequest";

/** Estatísticas da conta (GET /api/analytics/my-stats?days=). */
function useMyStats(days: number) {
  const [data, setData] = useState<MyStats>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const { start, isCurrent } = useLatestRequest();

  const fetchStats = useCallback(async () => {
    const id = start();
    try {
      setIsLoading(true);
      setError(null);
      const result = await analyticsService.getMyStats(days);
      if (isCurrent(id)) setData(result);
    } catch (err) {
      if (isCurrent(id)) setError(err);
    } finally {
      if (isCurrent(id)) setIsLoading(false);
    }
  }, [days, start, isCurrent]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, isLoading, error, refetch: fetchStats };
}

/** Estatísticas de um QR (GET /api/analytics/qr-code/:id?days=). Sem id, não pede nada. */
function useQrCodeStats(id: string | undefined, days: number) {
  const [data, setData] = useState<QrCodeStats>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { start, isCurrent } = useLatestRequest();

  const fetchStats = useCallback(async () => {
    const requestId = start();
    if (!id) {
      setData(undefined);
      setError(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      setData(undefined);
      const result = await analyticsService.getQrCodeStats(id, days);
      if (isCurrent(requestId)) setData(result);
    } catch (err) {
      if (isCurrent(requestId)) setError(err);
    } finally {
      if (isCurrent(requestId)) setIsLoading(false);
    }
  }, [id, days, start, isCurrent]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, isLoading, error, refetch: fetchStats };
}

export { useMyStats, useQrCodeStats };
