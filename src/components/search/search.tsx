import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui";
import { SearchIcon } from "lucide-react";
import { useGetQrcodes, useLang } from "@/hooks";
import { Link } from "react-router-dom";
import { PreviewQRCode } from "../previewQRCode";
import { images } from "@/assets";
import { formattedDate } from "@/utils";
import { getImageUrl } from "@/config";

const routeMap = {
  "/dashboard": "Dashboard",
  "/dashboard/my-qrcode": "My QR Codes",
  "/dashboard/subscription": "Subscription",
  "/dashboard/settings": "Settings",
};

function Search() {
  const [search, setSearch] = useState("");
  const { translations } = useLang();
  const { data } = useGetQrcodes();
  const t = translations.components.SidebarAppPrivate;

  const [isOpenDialogPrev, setIsOpenDialogPrev] = useState(false);
  const [searchIsOpenDialog, setSearchIsOpenDialog] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<any>(null);

  const availablePages = useMemo(
    () =>
      Object.entries(routeMap).map(([path, key]) => ({
        path,
        name: t.menu[key as keyof typeof t.menu] ?? key,
        type: "page" as const,
      })),
    [t],
  );

  const results = useMemo(() => {
    if (!search) return [];

    const lowerSearch = search.toLowerCase();

    const filteredPages = availablePages.filter((page) =>
      page.name?.toLowerCase().includes(lowerSearch),
    );

    const filteredQrcodes =
      data?.filter((qrcode) =>
        qrcode.title?.toLowerCase().includes(lowerSearch),
      ) ?? [];

    return [
      ...filteredPages,
      ...filteredQrcodes.map((qrcode) => ({
        name: qrcode.title,
        date: qrcode.createdAt,
        link: qrcode.targetUrl,
        image: getImageUrl(qrcode.imageUrl),
        type: "qrcode" as const,
      })),
    ];
  }, [search, availablePages, data]);

  function handleOpenPreview(item: any) {
    setSelectedQrCode(item);
    setSearchIsOpenDialog(false);
    setIsOpenDialogPrev(true);
  }

  return (
    <>
      {/* Diálogo de busca */}
      <Dialog
        open={searchIsOpenDialog}
        onOpenChange={(open) => setSearchIsOpenDialog(open)}>
        <DialogTrigger asChild>
          <SearchIcon size={18} className="cursor-pointer" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] p-0 pt-6 px-6">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 mb-4">
            <SearchIcon size={18} />
            <input
              className="outline-none border-b border-input w-full text-sm py-2"
              placeholder="Digite para buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {search &&
            (results.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-hidden overflow-y-scroll custom-scroll px-1">
                {results.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.type === "page" && (
                      <DialogClose asChild>
                        <Link
                          className="py-3 text-sm flex items-center justify-between hover:bg-accent/50 px-2 rounded transition-colors"
                          to={item.path}>
                          <span>{item.name}</span>
                          <span className="text-xs text-muted-foreground italic">
                            Página
                          </span>
                        </Link>
                      </DialogClose>
                    )}

                    {item.type === "qrcode" && (
                      <button
                        className="py-3 text-sm flex items-center justify-between hover:bg-accent/50 px-2 rounded transition-colors w-full"
                        onClick={() => handleOpenPreview(item)}>
                        <span>{item.name}</span>
                        <span className="text-xs text-muted-foreground italic">
                          QRCode
                        </span>
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <h2 className="text-sm text-muted-foreground py-2">
                Nenhum resultado encontrado
              </h2>
            ))}

          <DialogFooter />
        </DialogContent>
      </Dialog>

      {selectedQrCode && (
        <PreviewQRCode
          title={selectedQrCode.name}
          link={selectedQrCode.link ?? "Sem link"}
          image={selectedQrCode.image ?? images.qrCode.qr_code1}
          dateFormatted={formattedDate(selectedQrCode.date)}
          isOpen={isOpenDialogPrev}
          setIsOpen={setIsOpenDialogPrev}
        />
      )}
    </>
  );
}

export { Search };
