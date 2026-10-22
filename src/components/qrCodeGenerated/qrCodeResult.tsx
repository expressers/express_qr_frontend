import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, UserPlus } from "lucide-react";
import { Button, Spinner } from "../ui";
import { useGetQrDownload, useLang } from "@/hooks";
import type { QrFormat } from "@/service/api";

type QrCodeResultProps = {
  /** Data URL (or URL) of the generated image. */
  qrcode: string;
  /** Anonymous download: the server regenerates the file from the content. */
  content: string;
};

/** Inline reveal of the anonymous QR: preview plus PNG / SVG / PDF download and a save-to-account link. */
function QrCodeResult({ qrcode, content }: QrCodeResultProps) {
  const { downloadImg, isLoading } = useGetQrDownload();
  const [pending, setPending] = useState<QrFormat | null>(null);
  const { translations } = useLang();
  const t = translations.components.FormGeneratorQrc;

  async function handleDownload(format: QrFormat) {
    setPending(format);
    await downloadImg({ content }, format);
    setPending(null);
  }

  const busy = (format: QrFormat) => isLoading && pending === format;

  return (
    <div className="qr-reveal flex h-full flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold tracking-tight">{t.readyTitle}</h2>
        <p className="text-sm text-muted-foreground">{t.readyDescription}</p>
      </div>

      <div className="mx-auto aspect-square w-full max-w-[13rem] overflow-hidden rounded-lg border border-border bg-white p-2.5">
        <img src={qrcode} alt={t.imageAlt} className="size-full object-contain" />
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={isLoading}
          aria-label={`${t.download} PNG`}
          onClick={() => handleDownload("png")}>
          {busy("png") ? <Spinner /> : <Download />}
          {t.download} PNG
        </Button>
        <div className="grid grid-cols-2 gap-2">
          {(["svg", "pdf"] as const).map((format) => (
            <Button
              key={format}
              type="button"
              variant="outline"
              disabled={isLoading}
              aria-label={`${t.download} ${format.toUpperCase()}`}
              onClick={() => handleDownload(format)}>
              {busy(format) && <Spinner />}
              {format.toUpperCase()}
            </Button>
          ))}
        </div>
        <Button asChild variant="ghost" className="w-full">
          <Link to="/auth/signup">
            <UserPlus />
            {t.saveToAccount}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export { QrCodeResult };
