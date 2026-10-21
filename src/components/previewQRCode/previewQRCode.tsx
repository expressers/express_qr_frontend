import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui";

import { CalendarDays, FileText, LinkIcon } from "lucide-react";

interface PreviewQRCodeProps {
  title: string;
  link: string;
  image: string;
  dateFormatted: string;

  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function PreviewQRCode({
  title,
  link,
  image,
  dateFormatted,
  isOpen,
  setIsOpen,
}: PreviewQRCodeProps) {
  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogTrigger />
        <DialogContent className="px-2">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-center items-center  ">
            <div className="w-[70%] space-y-4">
              <div className="flex gap-1">
                <FileText size={18} />
                <span className="text-sm font-bold">{title}</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon size={14} />
                <span className="text-sm block  ">{link}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={14} />
                <span className="text-muted-foreground text-sm">
                  {dateFormatted}
                </span>
              </div>
              <div className="overflow-hidden rounded-md">
                <img src={image} alt="QR code" className="w-full" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export { PreviewQRCode };
