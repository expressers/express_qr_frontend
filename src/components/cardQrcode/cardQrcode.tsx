import { useMemo, useState, type ComponentProps } from "react";
import { Link } from "react-router-dom";
import { Download, Eye, Pencil, ScanLine, Trash2 } from "lucide-react";

import { Button } from "../ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { QrCodeGenerated } from "../qrCodeGenerated";
import { PreviewQRCode } from "../previewQRCode";
import { DeleteQrcodeDialog } from "./deleteQrcodeDialog";
import { QR_ROW_GRID } from "./qrRowGrid";
import { QrStatusBadge, QrTypeBadge } from "./qrBadges";
import { formattedDate } from "@/utils";
import { useLang } from "@/hooks";
import type { QrType } from "@/service/api";
import { cn } from "@/lib/utils";

interface CardQrcodeProps {
  id: string;
  image: string;
  title: string;
  link: string;
  date: string;
  scans: number;
  type?: QrType;
  isActive?: boolean;
  /** Posição na lista, para a entrada em cascata. */
  index?: number;
  /** Chamado depois de apagar, para a lista recarregar. */
  onDeleted?: () => void;
}

/** Botão de ícone com tooltip (alvo de 44 px em toque, 36 px com rato). */
function IconAction({
  label,
  className,
  children,
  ...props
}: ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          className={cn("size-11 md:size-9", className)}
          {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{label}</TooltipContent>
    </Tooltip>
  );
}

function CardQrcode({
  id,
  image,
  title,
  link,
  date,
  scans,
  type,
  isActive = true,
  index = 0,
  onDeleted,
}: CardQrcodeProps) {
  const { translations } = useLang();
  const t = translations.components.CardQrcode;
  const [isVisibleDialogSaveImg, setIsVisibleDialogSaveImg] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const dateFormatted = useMemo(() => formattedDate(date), [date]);

  return (
    <li
      style={{ "--i": index } as React.CSSProperties}
      className={cn(
        "row-enter grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-3 py-3 md:gap-x-4 md:px-4",
        QR_ROW_GRID,
        !isActive && "bg-muted/40",
      )}>
      <div className="size-12 overflow-hidden rounded-lg border bg-white p-1">
        <img src={image} alt="" className="size-full object-contain" />
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-medium">{title}</p>
          {type && <QrTypeBadge type={type} className="h-5 shrink-0 px-2" />}
        </div>
        <p
          className="truncate font-mono text-xs text-muted-foreground"
          title={link}>
          {link}
        </p>
      </div>

      <span className="hidden whitespace-nowrap text-sm text-muted-foreground tabular-nums xl:block">
        {dateFormatted}
      </span>

      {/* Móvel: segunda linha (estado, leituras, ações). Desktop: células da grelha. */}
      <div className="col-span-2 flex items-center justify-between gap-2 md:contents">
        <div className="flex items-center gap-2 md:contents">
          <span className="flex items-center gap-1.5 md:justify-self-start">
            <QrStatusBadge isActive={isActive} />
          </span>
          <span
            className="flex items-center gap-1.5 font-mono text-sm tabular-nums md:justify-self-end"
            title={t.scans}>
            <ScanLine size={14} aria-hidden className="text-muted-foreground md:hidden" />
            {scans}
            <span className="sr-only">{t.scans}</span>
          </span>
        </div>

        <div
          role="group"
          aria-label={t.actions.replace("{title}", title)}
          className="-mr-2 flex items-center md:mr-0">
          <IconAction label={t.preview} onClick={() => setIsOpenDialog(true)}>
            <Eye aria-hidden />
          </IconAction>
          <IconAction label={t.download} onClick={() => setIsVisibleDialogSaveImg(true)}>
            <Download aria-hidden />
          </IconAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-11 md:size-9"
                asChild>
                <Link to={`/dashboard/qrcode-edit/${id}`} aria-label={t.edit}>
                  <Pencil aria-hidden />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>{t.edit}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <DeleteQrcodeDialog id={id} title={title} onDeleted={onDeleted}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t.delete}
                  className="size-11 md:size-9">
                  <Trash2 aria-hidden />
                </Button>
              </TooltipTrigger>
            </DeleteQrcodeDialog>
            <TooltipContent sideOffset={6}>{t.delete}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <PreviewQRCode
        title={title}
        image={image}
        dateFormatted={dateFormatted}
        link={link}
        isOpen={isOpenDialog}
        setIsOpen={setIsOpenDialog}
      />
      <QrCodeGenerated
        id={id}
        isOpen={isVisibleDialogSaveImg}
        setIsOpen={setIsVisibleDialogSaveImg}
        qrcode={image}
      />
    </li>
  );
}

export { CardQrcode };
