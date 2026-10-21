import React, { useMemo, useState } from "react";

import { Button } from "../ui";
import { CalendarDays, Download, LinkIcon, Pencil, Eye } from "lucide-react";
import { QrCodeGenerated } from "../qrCodeGenerated";
import { Link } from "react-router-dom";
import { formattedDate } from "@/utils";
import { PreviewQRCode } from "../previewQRCode";

interface CardQrcodeProps {
  id: string;
  image: string;
  title: string;
  link: string;
  date: string;
  scans: number;
}

function CardQrcode({ id, image, title, link, date, scans }: CardQrcodeProps) {
  const [isVisibleDialogSaveImg, setIsVisibleDialogSaveImg] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const dateFormatted = useMemo(() => {
    return formattedDate(date);
  }, [date]);

  return (
    <React.Fragment>
      <div className="bg-card text-card-foreground rounded-xl border sm:px-6 px-3 py-4 flex flex-row  justify-between sm:space-y-2 space-y-2 w-full">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className=" w-16 overflow-hidden rounded-md">
            <img src={image} alt={title} className="w-full" />
          </div>
          <div className="space-y-1.5 ">
            <span className="block font-bold text-xs">{title}</span>

            <div className="flex items-center gap-2">
              <LinkIcon size={14} />
              <span className="text-xs w-16 block  truncate overflow-hidden whitespace-nowrap">
                {link}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={14} />
              <span className="text-muted-foreground sm:text-xs text-[.65rem]">
                {dateFormatted}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col  justify-between ">
          <div className="flex items-center gap-2 justify-end">
            <button className="bg-transparent p-0 border-none" onClick={() => setIsOpenDialog(true)}>
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

            <span className="sm:block bg-green-500/10 py-1 px-2 rounded-md text-[.8rem] sm:text-xs dark:text-green-200 font-semibold">
              {scans}
            </span>
          </div>

          <div className="flex justify-end gap-2 sm:gap-4">
            <QrCodeGenerated
              id={id}
              isOpen={isVisibleDialogSaveImg}
              setIsOpen={setIsVisibleDialogSaveImg}
              qrcode={image}
            />
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => setIsVisibleDialogSaveImg(true)}>
              <Download size={14} />
            </Button>

            <Button size="icon-sm" variant="outline" asChild>
              <Link to={`/dashboard/qrcode-edit/${id}`}>
                <Pencil size={12} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { CardQrcode };
