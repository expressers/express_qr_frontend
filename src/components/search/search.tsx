import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, QrCode, SearchIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui";
import { PreviewQRCode } from "../previewQRCode";
import { useLang, useQrcodeOptions } from "@/hooks";
import { images } from "@/assets";
import { formattedDate } from "@/utils";
import { getImageUrl } from "@/config";
import type { QrCode as QrCodeItem } from "@/service/api";
import { cn } from "@/lib/utils";

const routeMap = {
  "/dashboard": "dashboard",
  "/dashboard/my-qrcodes": "myQrcodes",
  "/dashboard/qrcode-generator": "createQrcodes",
  "/dashboard/subscription": "subscription",
  "/dashboard/statistic": "reports",
  "/dashboard/settings": "settings",
} as const;

interface QrcodeResult {
  name: string;
  date: string;
  link: string | null;
  image: string;
}

interface SearchProps {
  /** `icon` (cabeçalho) regista o atalho "/"; `field` parece um campo de pesquisa. */
  variant?: "icon" | "field";
  className?: string;
}

/** Corpo do diálogo: só é montado quando o diálogo está aberto; os QR vêm do componente pai (em cache). */
function SearchBody({
  onPreview,
  items,
  isLoading,
}: {
  onPreview: (item: QrcodeResult) => void;
  items: QrCodeItem[];
  isLoading: boolean;
}) {
  const [query, setQuery] = useState("");
  const { translations } = useLang();
  const t = translations.components.Search;
  const menu = translations.components.SidebarAppPrivate.menu;

  const pages = useMemo(
    () =>
      Object.entries(routeMap).map(([path, key]) => ({
        path,
        name: menu[key] ?? key,
      })),
    [menu],
  );

  const term = query.trim().toLowerCase();
  const matchedPages = term ? pages.filter((p) => p.name.toLowerCase().includes(term)) : [];
  const matchedQrcodes = term
    ? items.filter((qr) => qr.title?.toLowerCase().includes(term))
    : [];
  const hasResults = matchedPages.length + matchedQrcodes.length > 0;

  const rowClass =
    "flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors duration-(--dur-fast) hover:bg-muted focus-visible:bg-muted";

  return (
    <>
      <div className="flex items-center gap-3 border-b px-4">
        <SearchIcon size={18} aria-hidden className="shrink-0 text-muted-foreground" />
        <input
          autoFocus
          type="search"
          aria-label={t.label}
          className="h-14 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
          placeholder={t.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div
        className="custom-scroll max-h-[min(22rem,60dvh)] min-h-24 overflow-y-auto p-2"
        aria-live="polite">
        {!term ? (
          <p className="px-3 py-6 text-sm text-muted-foreground">
            {isLoading ? t.loading : t.hint}
          </p>
        ) : hasResults ? (
          <ul>
            {matchedPages.map((page) => (
              <li key={page.path}>
                <DialogClose asChild>
                  <Link to={page.path} className={rowClass}>
                    <FileText size={16} aria-hidden className="shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate">{page.name}</span>
                    <span className="text-xs text-muted-foreground">{t.page}</span>
                  </Link>
                </DialogClose>
              </li>
            ))}
            {matchedQrcodes.map((qr) => (
              <li key={qr.id}>
                <button
                  type="button"
                  className={rowClass}
                  onClick={() =>
                    onPreview({
                      name: qr.title ?? "",
                      date: qr.createdAt,
                      link: qr.targetUrl ?? qr.staticContent,
                      image: getImageUrl(qr.imageUrl ?? undefined),
                    })
                  }>
                  <QrCode size={16} aria-hidden className="shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{qr.title}</span>
                  <span className="text-xs text-muted-foreground">{t.qrcode}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : isLoading ? (
          <p className="px-3 py-6 text-sm text-muted-foreground">{t.loading}</p>
        ) : (
          <p className="px-3 py-6 text-sm text-muted-foreground">
            {t.empty.replace("{query}", query.trim())}
          </p>
        )}
      </div>
    </>
  );
}

function Search({ variant = "icon", className }: SearchProps) {
  const { translations } = useLang();
  const t = translations.components.Search;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [selected, setSelected] = useState<QrcodeResult | null>(null);
  // Os QR só são pedidos na primeira abertura e ficam em cache enquanto o componente existir.
  const [hasOpened, setHasOpened] = useState(false);
  const { items, isLoading, loaded, hasMore, loadMore, error } = useQrcodeOptions({
    enabled: hasOpened,
  });
  const isLoadingAll = hasOpened && !error && (!loaded || isLoading || hasMore);

  // Carrega todas as páginas, para a pesquisa cobrir todos os QR do utilizador.
  useEffect(() => {
    if (hasOpened && !error && !isLoading && hasMore) loadMore();
  }, [hasOpened, error, isLoading, hasMore, loadMore]);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  // Atalho "/" (só na instância do cabeçalho, para não abrir duas vezes).
  useEffect(() => {
    if (variant !== "icon") return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const el = event.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      event.preventDefault();
      setIsOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [variant]);

  function handlePreview(item: QrcodeResult) {
    setSelected(item);
    setIsOpen(false);
    setIsOpenPreview(true);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {variant === "field" ? (
            <button
              type="button"
              className={cn(
                "flex h-11 w-full items-center gap-3 rounded-full border border-input bg-card px-4 text-left text-sm text-muted-foreground transition-[border-color,color,transform] duration-(--dur-fast) ease-(--ease-out) hover:border-foreground hover:text-foreground active:scale-[.99] md:h-10",
                className,
              )}>
              <SearchIcon size={16} aria-hidden />
              <span className="flex-1 truncate">{translations.pages.MyQrcodes.search}</span>
              <kbd className="hidden rounded-md border px-1.5 font-mono text-xs sm:block">/</kbd>
            </button>
          ) : (
            <button
              type="button"
              aria-label={t.label}
              aria-keyshortcuts="/"
              className={cn(
                "grid size-10 place-items-center rounded-full text-foreground transition-[background-color,transform] duration-(--dur-fast) ease-(--ease-out) hover:bg-muted active:scale-[.95] md:size-11",
                className,
              )}>
              <SearchIcon size={18} aria-hidden />
            </button>
          )}
        </DialogTrigger>

        <DialogContent
          showCloseButton={false}
          className="top-[12dvh] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">{t.title}</DialogTitle>
          <DialogDescription className="sr-only">{t.hint}</DialogDescription>
          <SearchBody onPreview={handlePreview} items={items} isLoading={isLoadingAll} />
        </DialogContent>
      </Dialog>

      {selected && (
        <PreviewQRCode
          title={selected.name}
          link={selected.link ?? translations.pages.MyQrcodes.noLink}
          image={selected.image || images.qrCode.qr_code1}
          dateFormatted={formattedDate(selected.date)}
          isOpen={isOpenPreview}
          setIsOpen={setIsOpenPreview}
        />
      )}
    </>
  );
}

export { Search };
