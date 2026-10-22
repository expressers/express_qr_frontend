import { Ban } from "lucide-react";

import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useLang } from "@/hooks";
import { cn } from "@/lib/utils";
import type { AdminPagination } from "@/service/api";

const badge =
  "inline-flex h-6 items-center gap-1 rounded-full border px-2.5 text-xs font-medium leading-none whitespace-nowrap";

/** Estado da conta: texto sempre presente; o suspenso usa o token destrutivo e um ícone. */
function UserStatusBadge({ status }: { status: string }) {
  const { translations } = useLang();
  const label = (translations.pages.Admin.statuses as Record<string, string>)[status] ?? status;
  return (
    <span
      className={cn(
        badge,
        status === "ACTIVE" && "border-foreground text-foreground",
        status === "INACTIVE" && "border-dashed border-input text-muted-foreground",
        status === "PENDING_VERIFICATION" && "border-dotted border-input text-muted-foreground",
        status === "SUSPENDED" && "border-destructive text-destructive",
      )}>
      {status === "SUSPENDED" && <Ban className="size-3" aria-hidden />}
      {label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const { translations } = useLang();
  const label = (translations.pages.Admin.roles as Record<string, string>)[role] ?? role;
  return <span className={cn(badge, "border-border text-muted-foreground")}>{label}</span>;
}

/** Rodapé de paginação: intervalo, página actual e anterior/seguinte. */
function Pager({
  pagination,
  count,
  isLoading,
  onPage,
}: {
  pagination: AdminPagination;
  count: number;
  isLoading: boolean;
  onPage: (page: number) => void;
}) {
  const { translations } = useLang();
  const t = translations.pages.Admin.common;
  const { page, limit, total, totalPages } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = (page - 1) * limit + count;

  return (
    <nav
      aria-label={t.page.replace("{page}", String(page)).replace("{pages}", String(totalPages))}
      className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm">
      <p className="text-muted-foreground tabular-nums" aria-live="polite">
        {t.range
          .replace("{from}", String(from))
          .replace("{to}", String(to))
          .replace("{total}", String(total))}
      </p>
      <div className="flex items-center gap-2">
        <span className="hidden text-muted-foreground tabular-nums sm:inline">
          {t.page.replace("{page}", String(page)).replace("{pages}", String(totalPages))}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading || page <= 1}
          onClick={() => onPage(page - 1)}>
          {t.prev}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading || page >= totalPages}
          onClick={() => onPage(page + 1)}>
          {t.next}
        </Button>
      </div>
    </nav>
  );
}

function RowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2" role="status" aria-busy="true">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-11 w-full rounded-md" />
      ))}
    </div>
  );
}

export { UserStatusBadge, RoleBadge, Pager, RowsSkeleton };
