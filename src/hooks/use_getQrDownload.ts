import { useState } from "react";
import { qrCodeService } from "@/service/api";
import { toast } from "sonner";

function useGetQrDownload() {
  const [data, setData] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function downloadImg(data: { id: string; format: string }) {
    try {
      setIsLoading(true);
      const blob = await qrCodeService.getQrDownload(data);
      setData(blob);
      toast.success("Download Completo!", {
        className: "bg-green-500 text-white font-semibold",
      });
    } catch (error) {
      toast.error("Erro ao fazer download!", {
        className: "bg-red-500/10 text-white font-semibold",
      });
      console.error("error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return { data, downloadImg, isLoading };
}

export { useGetQrDownload };
