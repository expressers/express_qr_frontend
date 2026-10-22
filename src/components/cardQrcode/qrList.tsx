import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Skeleton } from "../ui";
import { QR_ROW_GRID } from "./qrRowGrid";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks";

/** Recipiente da lista de QR: uma moldura, linhas separadas por hairlines. */
function QrList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ul className={cn("divide-y overflow-hidden rounded-2xl border bg-card", className)}>
      {children}
    </ul>
  );
}

/** Cabeçalho de colunas (só md+), alinhado com {@link QR_ROW_GRID}. */
function QrListHeader({ labels }: { labels: { qr: string; created: string; status: string; scans: string; actions: string } }) {
  return (
    <div
      aria-hidden
      className={cn(
        "hidden gap-x-4 border-b bg-muted/50 px-4 py-2.5 text-xs font-medium text-muted-foreground md:grid",
        QR_ROW_GRID,
      )}>
      <span className="col-span-2">{labels.qr}</span>
      <span className="hidden xl:block">{labels.created}</span>
      <span>{labels.status}</span>
      <span className="text-right">{labels.scans}</span>
      <span className="sr-only">{labels.actions}</span>
    </div>
  );
}

/** Esqueleto com a forma real de uma linha. */
function QrListSkeleton({ count = 5 }: { count?: number }) {
  const { translations } = useLang();
  return (
    <div
      role="status"
      aria-busy="true"
      className="divide-y overflow-hidden rounded-2xl border bg-card">
      <span className="sr-only">{translations.components.Search.loading}</span>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-3 py-3 md:gap-4 md:px-4">
          <Skeleton className="size-12 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3 max-w-48" />
            <Skeleton className="h-3 w-2/3 max-w-72" />
          </div>
          <Skeleton className="hidden h-6 w-16 rounded-full sm:block" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      ))}
    </div>
  );
}

interface QrEmptyStateProps {
  icon: LucideIcon;
  title: string;
  body?: string;
  action?: ReactNode;
  /** `alert` para erros (anunciado de imediato por leitores de ecrã). */
  role?: "status" | "alert";
}

/** Estado vazio ou de erro: ícone, frase directa, uma acção. */
function QrEmptyState({ icon: Icon, title, body, action, role = "status" }: QrEmptyStateProps) {
  return (
    <div
      role={role}
      className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-input px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full border bg-card">
        <Icon size={22} strokeWidth={1.5} aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="text-base font-semibold">{title}</p>
        {body && <p className="mx-auto max-w-sm text-sm text-muted-foreground text-balance">{body}</p>}
      </div>
      {action}
    </div>
  );
}

export { QrList, QrListHeader, QrListSkeleton, QrEmptyState };
