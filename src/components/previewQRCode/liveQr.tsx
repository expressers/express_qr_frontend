import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import type { QrColors } from "@/utils/contrast";

interface LiveQrProps {
  content: string;
  colors: QrColors;
  alt: string;
  className?: string;
  /** Chamado quando o conteúdo não cabe num QR (ex.: texto demasiado longo). */
  onFailedChange?: (failed: boolean) => void;
}

/**
 * QR desenhado no browser enquanto o utilizador escreve. É só uma
 * pré-visualização: a imagem do servidor continua a ser a fonte de verdade.
 * A biblioteca carrega à parte para não pesar no resto da aplicação.
 */
function LiveQr({ content, colors, alt, className, onFailedChange }: LiveQrProps) {
  const [src, setSrc] = useState<string | null>(null);
  const { dark, light } = colors;

  useEffect(() => {
    let cancelled = false;
    import("qrcode")
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(content, {
          margin: 2,
          width: 480,
          errorCorrectionLevel: "M",
          color: { dark, light },
        }),
      )
      .then((url) => {
        if (cancelled) return;
        setSrc(url);
        onFailedChange?.(false);
      })
      .catch(() => {
        if (cancelled) return;
        setSrc(null);
        onFailedChange?.(true);
      });
    return () => {
      cancelled = true;
    };
  }, [content, dark, light, onFailedChange]);

  if (!src) return <div aria-hidden className={cn("size-full", className)} />;
  return <img src={src} alt={alt} className={cn("size-full object-contain", className)} />;
}

export { LiveQr };
