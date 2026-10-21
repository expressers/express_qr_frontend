import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { config } from "@/config";

interface RedirectResponse {
  targetUrl?: string;
  notFound?: boolean;
}

export function Redirect() {
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const resolveRedirect = async () => {
      try {
        const apiUrl = config.apiUrl;
        
        const response = await fetch(`${apiUrl}/r/${slug}?json=true`, {
          method: 'GET',
          mode: 'cors'
        });

        console.log('[Redirect] Status:', response.status);

        if (response.status === 404) {
          const data = await response.json() as RedirectResponse;
          console.log('[Redirect] Data:', data);
          if (data.notFound) {
            setError(true);
            return;
          }
        }

        const data = await response.json() as { targetUrl: string };
        console.log('[Redirect] Data:', data);

        if (data.targetUrl) {
          window.location.href = data.targetUrl;
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('[Redirect] Error:', err);
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
    backgroundColor: "#f5f5f5",
  },
  content: {
    textAlign: "center",
    padding: "2rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#333",
  },
  text: {
    fontSize: "1rem",
    color: "#666",
  },
};