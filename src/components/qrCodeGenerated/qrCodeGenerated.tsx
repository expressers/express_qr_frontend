import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectGroup,
  Button,
  Spinner,
} from "../ui";
import { Download } from "lucide-react";
import { useLang, useGetQrDownload } from "@/hooks";
import type { QrFormat } from "@/service/api";

type QrCodeGeneratedProps = {
  /** Fonte da imagem a mostrar (data URL ou URL). */
  qrcode: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} & (
  | { /** Anónimo: o servidor regenera o ficheiro a partir do conteúdo. */ content: string; id?: never }
  | {
      /** Autenticado: download do QR guardado. */ id: string;
      /** Usado no nome do ficheiro se o servidor não enviar `Content-Disposition`. */
      slug?: string | null;
      content?: never;
    }
);

function QrCodeGenerated({ qrcode, isOpen, setIsOpen, ...source }: QrCodeGeneratedProps) {
  const { downloadImg, isLoading } = useGetQrDownload();
  const [format, setFormat] = useState<QrFormat>("png");
  const { translations } = useLang();
  const t = translations.components.FormGeneratorQrc;

  const handleDownload = async () => {
    if (source.id) {
      await downloadImg({ id: source.id, slug: source.slug }, format);
    } else if (source.content) {
      await downloadImg({ content: source.content }, format);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{t.readyTitle}</DialogTitle>
          <DialogDescription className="text-center text-xs">
            {t.readyDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col justify-center items-center gap-4 py-4">
          <div className="w-[70%] space-y-2">
            <div className="overflow-hidden rounded-md bg-white">
              <img src={qrcode} alt={t.imageAlt} className="w-full" />
            </div>

            <div className="flex gap-2">
              <Select value={format} onValueChange={(value) => setFormat(value as QrFormat)}>
                <SelectTrigger
                  className="sm:py-6 sm:w-[18rem] w-[7.5rem]"
                  aria-label={t.formatPlaceholder}>
                  <SelectValue placeholder={t.formatPlaceholder} />
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
                aria-label={`${t.download} ${format.toUpperCase()}`}
                disabled={isLoading}
                onClick={handleDownload}>
                {isLoading ? <Spinner /> : <Download />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { QrCodeGenerated };
