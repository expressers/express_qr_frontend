import type { ReactNode } from "react";
import { CalendarDays, LinkIcon, QrCode } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks";

interface PreviewQRCodeProps {
  title: string;
  link: string;
  image: string;
  dateFormatted: string;

  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

/** Pré-visualização rápida de um QR guardado, em diálogo (lista e pesquisa). */
function PreviewQRCode({
  title,
  link,
  image,
  dateFormatted,
  isOpen,
  setIsOpen,
}: PreviewQRCodeProps) {
  const { translations } = useLang();
  const t = translations.components.FormGeneratorQrc;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{title}</DialogTitle>
          <DialogDescription className="sr-only">{link}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="mx-auto aspect-square w-full max-w-64 overflow-hidden rounded-xl border bg-white p-3">
            <img src={image} alt={t.imageAlt} className="size-full object-contain" />
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex min-w-0 items-center gap-2">
              <LinkIcon size={14} aria-hidden className="shrink-0 text-muted-foreground" />
              <span className="truncate font-mono text-xs" title={link}>
                {link}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CalendarDays size={14} aria-hidden className="shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground tabular-nums">{dateFormatted}</span>
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface QrPreviewPanelProps {
  /** Imagem do QR já gerada; sem ela mostra o estado vazio. */
  image?: string | null;
  title?: string;
  /** Destino em texto (URL ou conteúdo). */
  link?: string;
  /** Marcas junto ao título (tipo, estado). */
  badges?: ReactNode;
  /** Botões por baixo do QR. */
  actions?: ReactNode;
  /** Texto do estado vazio. */
  emptyHint: string;
  /** `reveal` para o QR acabado de gerar; `swap` quando a imagem muda numa edição. */
  motion?: "reveal" | "swap";
  className?: string;
}

/**
 * Painel de pré-visualização ao lado do formulário. O QR é produzido no
 * servidor, por isso o painel mostra título e destino em direto e a imagem
 * assim que existe.
 */
function QrPreviewPanel({
  image,
  title,
  link,
  badges,
  actions,
  emptyHint,
  motion = "reveal",
  className,
}: QrPreviewPanelProps) {
  const { translations } = useLang();
  const t = translations.components.CreateQrcode.preview;
  const alt = translations.components.FormGeneratorQrc.imageAlt;

  return (
    <section
      aria-label={t.title}
      className={cn("rounded-2xl border bg-card p-4 shadow-card sm:p-5", className)}>
      <div
        className={cn(
          "relative mx-auto aspect-square w-full max-w-72 overflow-hidden rounded-xl border bg-white p-3",
          !image && "border-dashed border-input bg-muted/40",
        )}>
        {image ? (
          <img
            key={image}
            src={image}
            alt={alt}
            className={cn(
              "size-full object-contain",
              motion === "reveal" ? "qr-reveal" : "qr-swap",
            )}
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
            <QrCode size={40} strokeWidth={1.25} aria-hidden />
            <p className="text-sm text-balance">{emptyHint}</p>
          </div>
        )}
      </div>

      <div className="mt-4 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "min-w-0 truncate text-base font-semibold",
              !title && "text-muted-foreground",
            )}>
            {title || t.untitled}
          </p>
          {badges}
        </div>
        <p className="sr-only">{t.destination}</p>
        <p
          className={cn(
            "truncate font-mono text-xs",
            link ? "text-foreground" : "text-muted-foreground",
          )}
          title={link}>
          {link || "https://"}
        </p>
      </div>

      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </section>
  );
}

export { PreviewQRCode, QrPreviewPanel };
