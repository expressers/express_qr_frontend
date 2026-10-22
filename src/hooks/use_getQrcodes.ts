import { qrCodeService, type QrCode, type QrCodeList } from "@/service/api";
import { useEffect, useState, useCallback, useRef } from "react";
import { CACHE } from "@/utils";

// Prefixo limpo no logout e após criar/editar/apagar (ver utils/session).
const CACHE_PREFIX = "qrcodes";
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Lista paginada dos QR do utilizador. `isActive` filtra no servidor
 * (`undefined` = todos; ao mudar o filtro, o chamador repõe a página 1).
 * Respostas de pedidos antigos (página ou filtro entretanto mudados) são ignoradas.
 */
function useGetQrcodes(take = 6, isActive?: boolean) {
  const [data, setData] = useState<QrCode[] | null>(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [page, setPage] = useState(1);
  const requestId = useRef(0);

  const fetchQrcodes = useCallback(
    async (page = 1, force = false) => {
      const id = ++requestId.current;
      const filterKey = isActive === undefined ? "all" : String(isActive);
      const cacheKey = `${CACHE_PREFIX}-${take}-${filterKey}-${page}`;
      if (!force) {
        const cached = CACHE.get<QrCodeList>(cacheKey, CACHE_TTL);
        if (cached && Array.isArray(cached.qrcodes)) {
          setData(cached.qrcodes);
          setTotal(cached.total ?? cached.qrcodes.length);
          setError(null);
          setIsLoading(false);
          return;
        }
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await qrCodeService.list({
          skip: (page - 1) * take,
          take,
          isActive,
        });
        if (id !== requestId.current) return;
        setData(result.qrcodes);
        setTotal(result.total ?? result.qrcodes.length);
        CACHE.set(cacheKey, result);
      } catch (err) {
        if (id !== requestId.current) return;
        setError(err);
        setData([]);
      } finally {
        if (id === requestId.current) setIsLoading(false);
      }
    },
    [take, isActive],
  );

  useEffect(() => {
    fetchQrcodes(page);
  }, [fetchQrcodes, page]);

  // Pedidos em curso deixam de contar quando o componente desmonta.
  useEffect(
    () => () => {
      requestId.current++;
    },
    [],
  );

  const totalPages = Math.max(1, Math.ceil(total / take));

  return {
    data,
    total,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
    hasMore: page < totalPages,
    refetchQrcodes: (force = true) => fetchQrcodes(page, force),
  };
}

export { useGetQrcodes };
