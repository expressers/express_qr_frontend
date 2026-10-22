import { useCallback, useEffect, useState } from "react";
import { qrCodeService, type QrCode } from "@/service/api";
import { useLatestRequest } from "./use_latestRequest";

/** Máximo por página aceite por GET /api/qrcodes. */
const PAGE_SIZE = 100;

/**
 * Todos os QR do utilizador para seletores, carregados 100 a 100.
 * `loadMore()` pede a página seguinte até `total`.
 */
function useQrcodeOptions({ enabled = true }: { enabled?: boolean } = {}) {
  const [items, setItems] = useState<QrCode[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [loaded, setLoaded] = useState(false);
  const { start, isCurrent } = useLatestRequest();

  const fetchPage = useCallback(
    async (skip: number) => {
      const id = start();
      try {
        setIsLoading(true);
        setError(null);
        const result = await qrCodeService.list({ skip, take: PAGE_SIZE });
        if (!isCurrent(id)) return;
        setItems((prev) => {
          // Evita duplicados se a lista mudou entre páginas.
          const base = skip === 0 ? [] : prev;
          const seen = new Set(base.map((qr) => qr.id));
          return [...base, ...result.qrcodes.filter((qr) => !seen.has(qr.id))];
        });
        setTotal(result.total ?? result.qrcodes.length);
      } catch (err) {
        if (isCurrent(id)) setError(err);
      } finally {
        if (isCurrent(id)) {
          setIsLoading(false);
          setLoaded(true);
        }
      }
    },
    [start, isCurrent],
  );

  useEffect(() => {
    if (enabled) fetchPage(0);
  }, [fetchPage, enabled]);

  const hasMore = items.length < total;
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) fetchPage(items.length);
  }, [fetchPage, hasMore, isLoading, items.length]);

  return { items, total, isLoading, loaded, error, hasMore, loadMore };
}

export { useQrcodeOptions };
