import { useState } from "react";
import { toast } from "sonner";
import { qrCodeService } from "@/service/api";
import { clearQrCaches, getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";

/** Apaga um QR (DELETE /api/qrcodes/:id) e invalida as caches da lista. */
function useDeleteQrcode() {
  const { translations } = useLang();
  const t = translations.components.CardQrcode;
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteQrcode(id: string): Promise<boolean> {
    try {
      setIsDeleting(true);
      await qrCodeService.remove(id);
      clearQrCaches();
      toast.success(t.deleteSuccess);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, translations.errors, t.deleteError));
      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  return { deleteQrcode, isDeleting };
}

export { useDeleteQrcode };
