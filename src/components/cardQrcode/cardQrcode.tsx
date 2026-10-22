import React, { useMemo, useState } from "react";

import { Button } from "../ui";
import { CalendarDays, Download, LinkIcon, Pencil, Eye, Trash2 } from "lucide-react";
import { QrCodeGenerated } from "../qrCodeGenerated";
import { Link } from "react-router-dom";
import { formattedDate } from "@/utils";
import { useLang } from "@/hooks";
import { PreviewQRCode } from "../previewQRCode";
import { DeleteQrcodeDialog } from "./deleteQrcodeDialog";

interface CardQrcodeProps {
  id: string;
  image: string;
  title: string;
  link: string;
  date: string;
  scans: number;
  isActive?: boolean;
  /** Chamado depois de apagar, para a lista recarregar. */
  onDeleted?: () => void;
}

function CardQrcode({
  id,
  image,
  title,
  link,
  date,
  scans,
  isActive = true,
  onDeleted,
}: CardQrcodeProps) {
  const { translations } = useLang();
  const t = translations.components.CardQrcode;
  const [isVisibleDialogSaveImg, setIsVisibleDialogSaveImg] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const dateFormatted = useMemo(() => formattedDate(date), [date]);

  return (
    <React.Fragment>
      <div className="bg-card text-card-foreground rounded-xl border sm:px-6 px-3 py-4 flex flex-row justify-between space-y-2 w-full">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="w-16 overflow-hidden rounded-md">
            <img src={image} alt={title} className="w-full" />
          </div>
          <div className="space-y-1.5">
            <span className="block font-bold text-xs">{title}</span>

            <div className="flex items-center gap-2">
              <LinkIcon size={14} aria-hidden />
              <span className="text-xs w-16 block truncate overflow-hidden whitespace-nowrap">
                {link}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={14} aria-hidden />
              <span className="text-muted-foreground sm:text-xs text-[.65rem]">
                {dateFormatted}
              </span>
            </div>

            {!isActive && (
              <span className="inline-block text-[.65rem] font-semibold text-muted-foreground border rounded px-1.5">
                {t.inactive}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              className="bg-transparent p-0 border-none"
              aria-label={t.preview}
              onClick={() => setIsOpenDialog(true)}>
              <Eye size={18} />
            </button>
            <PreviewQRCode
              title={title}
              image={image}
              dateFormatted={dateFormatted}
              link={link}
              isOpen={isOpenDialog}
              setIsOpen={setIsOpenDialog}
            />

            <span
              className="sm:block py-1 px-2 rounded-md border text-[.8rem] sm:text-xs font-semibold"
              title={t.scans}>
              {scans}
            </span>
          </div>

          <div className="flex justify-end gap-2 sm:gap-3">
            <QrCodeGenerated
              id={id}
              isOpen={isVisibleDialogSaveImg}
              setIsOpen={setIsVisibleDialogSaveImg}
              qrcode={image}
            />
            <Button
              size="icon-sm"
              variant="outline"
              aria-label={t.download}
              onClick={() => setIsVisibleDialogSaveImg(true)}>
              <Download size={14} />
            </Button>

            <Button size="icon-sm" variant="outline" asChild>
              <Link to={`/dashboard/qrcode-edit/${id}`} aria-label={t.edit}>
                <Pencil size={12} />
              </Link>
            </Button>

            <DeleteQrcodeDialog id={id} title={title} onDeleted={onDeleted}>
              <Button size="icon-sm" variant="outline" aria-label={t.delete}>
                <Trash2 size={12} />
              </Button>
            </DeleteQrcodeDialog>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { CardQrcode };
