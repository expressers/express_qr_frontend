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
  Skeleton,
} from "@/components";
import { ListFilter } from "lucide-react";
import {images} from "@/assets"
import { useGetQrcodes, useLang } from "@/hooks";
import { Toaster } from "sonner";
import { getImageUrl } from "@/config";

type QrcodeStatus = "ACTIVE" | "INACTIVE" | "All";

interface ApiQrcode {
  id: string;
  title?: string;
  targetUrl?: string;
  createdAt: string;
  status?: "ACTIVE" | "INACTIVE";
  type: "STATIC" | "DYNAMIC";
  imageUrl?: string;
}

interface MappedQrcode {
  id: string;
  title: string;
  link: string;
  date: string;
  scans: number;
  image: string;
  status: QrcodeStatus;
}

function MyQrcodes() {
  const { translations } = useLang();
  const { data, isLoading, page, setPage, hasMore } = useGetQrcodes();
  const t = translations.pages.MyQrcodes;

  const [statusFilter, setStatusFilter] = useState<QrcodeStatus>("All");

  const mapQrcodeData = (item: ApiQrcode): MappedQrcode => ({
    id: item.id,
    title: item.title || "Sem título",
    link: item.targetUrl?.replace(/^https?:\/\//, "") || "Sem link",
    date: item.createdAt,
    scans: 0,
    image: getImageUrl(item.imageUrl) || images.qrCode.qr_code1,
    status: item.status || "INACTIVE",
  });

  const filteredItems = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const mapped = data.map(mapQrcodeData);

    if (statusFilter === "All") {
      return mapped;
    }

    return mapped.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  const filterLabel = useMemo(() => {
    switch (statusFilter) {
      case "ACTIVE":
        return t.active;
      case "INACTIVE":
        return t.inactive;
      default:
        return t.all;
    }
  }, [statusFilter, t]);

  const handleFilter = (status: QrcodeStatus) => {
    setStatusFilter(status);
  };

  return (
    <div className=" space-y-8 h-full">
      <Toaster richColors />

      <div className="flex justify-between items-center">
        <h3 className="sm:text-lg text-sm font-bold">{t.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2">
              <ListFilter size={18} />
              <span className="text-xs font-semibold">{filterLabel}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleFilter("All")}>
              {t.all}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("ACTIVE")}>
              {t.active}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("INACTIVE")}>
              {t.inactive}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 sm:gap-8 gap-4 custom-cols-2 custom-cols-1">
          {Array.from({ length: data?.length ?? 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-36 bg-card text-card-foreground rounded-xl border sm:px-6 px-3 py-4 flex flex-row"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <p className="text-sm font-medium">{t.noQr}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:gap-8 gap-4 custom-cols-2 custom-cols-1">
          {filteredItems.map((item) => (
            <CardQrcode {...item} key={item.id} />
          ))}
          <CreateQrcode />
        </div>
      )}
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={page === 1 ? "opacity-50 pointer-events-none" : ""}
            />
          </PaginationItem>

          <PaginationItem>
            <span className="px-3 text-sm font-semibold">{page}</span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => hasMore && setPage((p) => p + 1)}
              className={!hasMore ? "opacity-50 pointer-events-none" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export { MyQrcodes };
