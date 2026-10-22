import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Spinner,
} from "../ui";
import { useDeleteQrcode, useLang } from "@/hooks";

interface DeleteQrcodeDialogProps {
  id: string;
  title: string;
  /** Chamado depois de o QR ser apagado com sucesso. */
  onDeleted?: () => void;
  /** Botão que abre a confirmação. */
  children: React.ReactNode;
}

/** Confirmação antes de apagar um QR (DELETE /api/qrcodes/:id). */
function DeleteQrcodeDialog({ id, title, onDeleted, children }: DeleteQrcodeDialogProps) {
  const { translations } = useLang();
  const t = translations.components.CardQrcode;
  const { deleteQrcode, isDeleting } = useDeleteQrcode();
  const [open, setOpen] = useState(false);

  async function handleConfirm(event: React.MouseEvent) {
    // Mantém o diálogo aberto enquanto o pedido corre.
    event.preventDefault();
    const ok = await deleteQrcode(id);
    if (ok) {
      setOpen(false);
      onDeleted?.();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.deleteDescription.replace("{title}", title)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting && <Spinner />}
            {t.confirmDelete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteQrcodeDialog };
