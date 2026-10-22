import { useMemo, useState } from "react";
import {
  CardQrcode,
  CreateQrcode,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Button,
  Skeleton,
} from "@/components";
import { ListFilter } from "lucide-react";
import { images } from "@/assets";
import { useGetQrcodes, useLang } from "@/hooks";
import { getImageUrl } from "@/config";

type StatusFilter = "ACTIVE" | "INACTIVE" | "ALL";

function MyQrcodes() {
  const { translations } = useLang();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  // O filtro é aplicado no servidor: a paginação e o total respeitam-no.
  const isActiveFilter = statusFilter === "ALL" ? undefined : statusFilter === "ACTIVE";
  const { data, total, isLoading, error, page, setPage, totalPages, hasMore, refetchQrcodes } =
    useGetQrcodes(6, isActiveFilter);
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
      isActive: item.isActive,
      image: getImageUrl(item.imageUrl ?? undefined) || images.qrCode.qr_code1,
    }));
  }, [data, t]);

  const filterLabel =
    statusFilter === "ACTIVE" ? t.active : statusFilter === "INACTIVE" ? t.inactive : t.all;

  const handleDeleted = () => {
    // Se a página ficou vazia, recua uma página; senão recarrega a atual.
    if ((data?.length ?? 0) <= 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      refetchQrcodes();
    }
  };

  return (
    <div className="space-y-8 h-full">

      <div className="flex justify-between items-center">
        <div>
          <h3 className="sm:text-lg text-sm font-bold">{t.title}</h3>
          <span className="text-xs text-muted-foreground">
            {t.total.replace("{total}", String(total))}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label={t.filter}>
            <div className="flex items-center gap-2">
              <ListFilter size={18} aria-hidden />
              <span className="text-xs font-semibold">{filterLabel}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => changeFilter("ALL")}>{t.all}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeFilter("ACTIVE")}>
              {t.active}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeFilter("INACTIVE")}>
              {t.inactive}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 sm:gap-8 gap-4 custom-cols-2 custom-cols-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-xl border" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-48">
          <p className="text-sm font-medium">{t.loadError}</p>
        </div>
      ) : items.length === 0 && statusFilter !== "ALL" ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <p className="text-sm font-medium text-muted-foreground">{t.noQrFiltered}</p>
          <Button variant="outline" size="sm" onClick={() => changeFilter("ALL")}>
            {t.clearFilter}
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <p className="text-sm font-medium text-muted-foreground">{t.noQr}</p>
          <CreateQrcode />
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:gap-8 gap-4 custom-cols-2 custom-cols-1">
          {items.map((item) => (
            <CardQrcode {...item} key={item.id} onDeleted={handleDeleted} />
          ))}
          <CreateQrcode />
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className={page === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="px-3 text-sm font-semibold">
                {page} / {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => hasMore && setPage((p) => p + 1)}
                className={!hasMore ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export { MyQrcodes };
