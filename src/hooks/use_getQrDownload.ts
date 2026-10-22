import { useState } from "react";
import { toast } from "sonner";
import { qrCodeService, type QrFormat } from "@/service/api";
import { getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";

/** Anónimo usa o conteúdo; autenticado usa o id do QR guardado. */
export type QrDownloadSource = { content: string } | { id: string; slug?: string | null };

/** Nome usado quando o servidor não envia (ou o CORS esconde) `Content-Disposition`. */
function fallbackFilename(source: QrDownloadSource, format: QrFormat): string {
  if ("id" in source) return `expressqr-${source.slug || source.id}.${format}`;
  return `expressqr.${format}`;
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revogar já pode cancelar o download nalguns browsers (Safari/Firefox).
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function useGetQrDownload() {
  const { translations } = useLang();
  const t = translations.components.FormGeneratorQrc;
  const [isLoading, setIsLoading] = useState(false);

  async function downloadImg(source: QrDownloadSource, format: QrFormat) {
    try {
      setIsLoading(true);
      const { blob, filename } =
        "id" in source
          ? await qrCodeService.download(source.id, format)
          : await qrCodeService.downloadPublic({ content: source.content, format });
      saveBlob(blob, filename ?? fallbackFilename(source, format));
      toast.success(t.downloadSuccess);
    } catch (error) {
      toast.error(getErrorMessage(error, translations.errors, t.downloadError));
    } finally {
      setIsLoading(false);
    }
  }

  return { downloadImg, isLoading };
}

export { useGetQrDownload };
