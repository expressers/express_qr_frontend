import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, QrCode, SearchX, TriangleAlert } from "lucide-react";

import { Button } from "@/components";
import {
  CardQrcode,
  QrEmptyState,
  QrList,
  QrListHeader,
  QrListSkeleton,
} from "@/components/cardQrcode";
import { CreateQrcode } from "@/components/createQrcode";
import { Search } from "@/components/search";
import { images } from "@/assets";
import { useGetQrcodes, useLang } from "@/hooks";
import { getImageUrl } from "@/config";
import { cn } from "@/lib/utils";

type StatusFilter = "ACTIVE" | "INACTIVE" | "ALL";

const PAGE_SIZE = 6;

function MyQrcodes() {
  const { translations } = useLang();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  // O filtro é aplicado no servidor: a paginação e o total respeitam-no.
  const isActiveFilter = statusFilter === "ALL" ? undefined : statusFilter === "ACTIVE";
  const { data, total, isLoading, error, page, setPage, totalPages, hasMore, refetchQrcodes } =
    useGetQrcodes(PAGE_SIZE, isActiveFilter);
  const t = translations.pages.MyQrcodes;

  const changeFilter = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setPage(1);
  };

  const items = useMemo(() => {
    return (data ?? []).map((item) => ({
      id: item.id,
      title: item.title || t.noTitle,
      link:
        (item.targetUrl ?? item.staticContent)?.replace(/^https?:\/\//, "") ||
        t.noLink,
      date: item.createdAt,
      scans: item.scanCount ?? 0,
      type: item.type,
      isActive: item.isActive,
      image: getImageUrl(item.imageUrl ?? undefined) || images.qrCode.qr_code1,
    }));
  }, [data, t]);

  // `data` é null até ao primeiro pedido terminar: nunca mostrar "vazio" nesse intervalo.
  const isPending = isLoading || data === null;

  const filters: { value: StatusFilter; label: string }[] = [
    { value: "ALL", label: t.all },
    { value: "ACTIVE", label: t.active },
    { value: "INACTIVE", label: t.inactive },
  ];

  const handleDeleted = () => {
    // Se a página ficou vazia, recua uma página; senão recarrega a atual.
    if ((data?.length ?? 0) <= 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      refetchQrcodes();
    }
  };

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-mono tabular-nums">{t.total.replace("{total}", String(total))}</span>
          </p>
        </div>
        <Button asChild className="hidden sm:inline-flex">
          <Link to="/dashboard/qrcode-generator">{translations.components.CreateQrcode.cta}</Link>
        </Button>
      </header>

      {/* Barra de ferramentas: pesquisa + filtro de estado (no servidor) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Search variant="field" className="sm:max-w-sm sm:flex-1" />
        <div
          role="group"
          aria-label={t.filter}
          className="inline-flex w-full rounded-full border bg-card p-1 sm:w-auto">
          {filters.map((filter) => {
            const selected = statusFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={selected}
                onClick={() => changeFilter(filter.value)}
                className={cn(
                  "h-9 flex-1 rounded-full px-4 text-sm font-medium transition-[background-color,color,transform] duration-(--dur-fast) ease-(--ease-out) active:scale-[.97] sm:flex-none",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}>
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {isPending && !error ? (
        <QrListSkeleton count={PAGE_SIZE} />
      ) : error ? (
        <QrEmptyState
          role="alert"
          icon={TriangleAlert}
          title={t.loadError}
          action={
            <Button variant="outline" onClick={() => refetchQrcodes()}>
              {t.retry}
            </Button>
          }
        />
      ) : items.length === 0 && statusFilter !== "ALL" ? (
        <QrEmptyState
          icon={SearchX}
          title={t.noQrFiltered}
          action={
            <Button variant="outline" onClick={() => changeFilter("ALL")}>
              {t.clearFilter}
            </Button>
          }
        />
      ) : items.length === 0 ? (
        <QrEmptyState
          icon={QrCode}
          title={t.noQr}
          body={t.emptyBody}
          action={<CreateQrcode className="w-full max-w-xs" />}
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border bg-card">
            <QrListHeader
              labels={{
                qr: t.colQr,
                created: t.colCreated,
                status: t.colStatus,
                scans: t.colScans,
                actions: t.colActions,
              }}
            />
            <QrList className="rounded-none border-0">
              {items.map((item, index) => (
                <CardQrcode {...item} index={index} key={item.id} onDeleted={handleDeleted} />
              ))}
            </QrList>
          </div>
          <CreateQrcode />
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label={t.title}
          className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
            <span className="hidden sm:inline">
              {t.showing
                .replace("{from}", String(from))
                .replace("{to}", String(to))
                .replace("{total}", String(total))}
              {" · "}
            </span>
            {t.pageOf.replace("{page}", String(page)).replace("{total}", String(totalPages))}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-11 md:h-10"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}>
              <ChevronLeft aria-hidden />
              {t.previous}
            </Button>
            <Button
              variant="outline"
              className="h-11 md:h-10"
              disabled={!hasMore}
              onClick={() => hasMore && setPage((p) => p + 1)}>
              {t.next}
              <ChevronRight aria-hidden />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}

export { MyQrcodes };
