import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BrandMark, Button } from "@/components";
import { useLang } from "@/hooks";
import { config } from "@/config";
import { getSafeRedirectUrl } from "@/utils/safeUrl";

export function Redirect() {
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState(false);
  const [host, setHost] = useState<string>();
  const { translations } = useLang();
  const t = translations.pages.System.redirect;
  // Cada pedido regista uma leitura: em StrictMode o efeito correria duas vezes.
  const requested = useRef(false);

  useEffect(() => {
    if (!slug || requested.current) return;
    requested.current = true;

    const resolveRedirect = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/r/${encodeURIComponent(slug)}?json=true`,
          { method: "GET", mode: "cors" },
        );
        // QR inactivo ou apagado → 404 com envelope de erro `NOT_FOUND`.
        if (!response.ok) {
          setError(true);
          return;
        }

        const data = (await response.json()) as { targetUrl?: unknown };
        // Só destinos http(s): `javascript:`, `data:` e afins nunca são seguidos.
        const target = getSafeRedirectUrl(data.targetUrl);
        if (target) {
          // Mostra o destino enquanto o browser navega.
          setHost(new URL(target).host);
          window.location.replace(target);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    };

    resolveRedirect();
  }, [slug]);

  return (
    <main className="flex min-h-dvh flex-col bg-background px-6 py-8">
      <BrandMark />
      <div
        key={error ? "alert" : "status"}
        className="flex flex-1 flex-col justify-center gap-6 pb-16"
        role={error ? "alert" : "status"}>
        <div className="max-w-md space-y-2">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-balance">
            {error ? t.errorTitle : t.loadingTitle}
          </h1>
          <p className="text-muted-foreground">{error ? t.errorText : t.loadingText}</p>
          {!error && host && (
            <p className="truncate font-mono text-sm" title={host}>
              {host}
            </p>
          )}
        </div>
        {error ? (
          <Button size="lg" className="w-fit" asChild>
            <Link to="/">{t.action}</Link>
          </Button>
        ) : (
          <div className="h-1 w-40 overflow-hidden rounded-full bg-muted" aria-hidden>
            <div className="h-full w-1/3 animate-[redirect-bar_1.2s_var(--ease-in-out)_infinite] rounded-full bg-foreground motion-reduce:animate-none" />
          </div>
        )}
      </div>
    </main>
  );
}
