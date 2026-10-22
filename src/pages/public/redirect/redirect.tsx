import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { config } from "@/config";
import { getSafeRedirectUrl } from "@/utils/safeUrl";

export function Redirect() {
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState(false);
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

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>QR Code não encontrado</h1>
          <p style={styles.text}>
            Este QR code pode ter sido removido ou desativado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Redirecionando...</h1>
        <p style={styles.text}>
          A redirecionar para o destino pretendido.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "var(--background)",
  },
  content: {
    textAlign: "center",
    padding: "2rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "var(--foreground)",
  },
  text: {
    fontSize: "1rem",
    color: "var(--muted-foreground)",
  },
};