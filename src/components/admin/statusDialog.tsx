import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Spinner,
} from "../ui";
import { useLang } from "@/hooks";
import { adminService, type AdminUser, type ManagedStatus } from "@/service/api";
import { getErrorMessage } from "@/utils";

interface StatusChange {
  user: AdminUser;
  status: ManagedStatus;
}

/** Confirmação antes de mudar o estado de uma conta (inactivar e suspender terminam as sessões). */
function StatusDialog({
  change,
  onClose,
  onDone,
}: {
  change: StatusChange | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const { translations } = useLang();
  const t = translations.pages.Admin;
  const [isLoading, setIsLoading] = useState(false);
  const statuses = t.statuses as Record<string, string>;
  const descriptions = t.statusDialog as unknown as Record<string, string>;

  async function confirm() {
    if (!change) return;
    try {
      setIsLoading(true);
      await adminService.changeStatus(change.user.id, change.status);
      toast.success(t.statusDialog.success);
      onDone();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, translations.errors, t.statusDialog.error));
    } finally {
      setIsLoading(false);
    }
  }

  const destructive = change?.status === "SUSPENDED" || change?.status === "INACTIVE";

  return (
    <AlertDialog open={!!change} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t.statusDialog.title.replace("{status}", change ? (statuses[change.status] ?? change.status).toLowerCase() : "")}
          </AlertDialogTitle>
          <AlertDialogDescription className="break-words">
            {change ? (descriptions[change.status] ?? "").replace("{email}", change.user.email) : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t.statusDialog.cancel}</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            disabled={isLoading}
            onClick={(event) => {
              // Mantém o diálogo aberto até o pedido terminar.
              event.preventDefault();
              void confirm();
            }}>
            {isLoading && <Spinner />}
            {t.statusDialog.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { StatusDialog, type StatusChange };
