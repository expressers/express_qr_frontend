import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectGroup,
  Button,
  Spinner,
  Toaster,
} from "../ui";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Download } from "lucide-react";
import { useLang, useGetQrDownload } from "@/hooks";

interface QrCodeGeneratedProps {
  qrcode: string;
  isOpen: boolean;
  id: string;
  setIsOpen: (open: boolean) => void;
}

function QrCodeGenerated({
  id,
  qrcode,
  isOpen,
  setIsOpen,
}: QrCodeGeneratedProps) {
  const { data, downloadImg, isLoading } = useGetQrDownload();
  const [format, setFormat] = useState("png");
  const { translations } = useLang();

  const t = translations.components.FormGeneratorQrc;
  const handleDownload = async () => {
    if (!id) return;
    await downloadImg({ id, format });
  };

  
  useEffect(() => {

    if (data) {
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bisc8Qr.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [data]);


  return (
    <React.Fragment>
      <Toaster richColors/>
      <div>
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className="flex flex-col justify-center items-center gap-4 py-4 space-y-4">
              <div className="space-y-2 flex items-center justify-center flex-col">
                <span className="text-center font-bold lg:text-xl md:text-xl text-md">
                  {t.readyTitle}
                </span>
                <p className="text-center text-xs">{t.readyDescription}</p>
              </div>

              <div className="w-[70%] space-y-2">
                <div className="overflow-hidden rounded-md">
                  <img src={qrcode} alt="QR code" className="w-full" />
                </div>

                <div className="flex gap-2">
                  <Select
                    value={format}
                    onValueChange={(value) => setFormat(value)} >
                    <SelectTrigger className="sm:py-6 sm:w-[18rem] w-[7.5rem]">
                      <SelectValue placeholder="Formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t.formatsLabel}</SelectLabel>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="svg">SVG</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Button
                    className="md:p-6 p-2 rounded-sm cursor-pointer"
                    size="icon"
                    variant="default"
                    disabled={isLoading}
                    onClick={handleDownload}>
                    {isLoading && <Spinner/>}
                   {!isLoading && <Download />}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
}

export { QrCodeGenerated };
