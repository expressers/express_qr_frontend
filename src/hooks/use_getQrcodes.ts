import { qrCodeService, type QrCode } from "@/service/api";
import { useEffect, useState, useCallback } from "react";
import { CACHE } from "@/utils";


const CACHE_KEY = "qrcodes";
const CACHE_TTL = 24 * 60 * 60 * 1000;

function useGetQrcodes(take = 6) {
  const [data, setData] = useState<QrCode[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  
  const fetchQrcodes = useCallback(
    async (page = 1, force = false) => {
      if (!force) {
        const cached = CACHE.get<QrCode[]>(`${CACHE_KEY}-${page}`, CACHE_TTL);
        if (cached) {
          setData(cached);
          return;
        }
      }

      try {
        setIsLoading(true);
        const skip = (page - 1) * take;
        const response = await qrCodeService.list({ skip, take });
        const { data } = response.data;

        if (response.data.success) {
          const qrcodes = data.qrcodes;
          setData(qrcodes);
          setHasMore(qrcodes.length === take); 
          CACHE.set(`${CACHE_KEY}-${page}`, qrcodes);
        } else {
          throw new Error(`Erro ${response.status}`);
         
        }
      } catch (error) {
        console.error("Erro ao buscar QR Codes:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [take],
  );

  useEffect(() => {
    fetchQrcodes(page);
  }, [fetchQrcodes, page]);

  return {
    data,
    isLoading,
    page,
    setPage,
    hasMore,
    refetchQrcodes: (force = true) => fetchQrcodes(page, force),
  };
}


export { useGetQrcodes };
