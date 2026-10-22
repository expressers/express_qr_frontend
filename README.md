# express_qr_frontend

Frontend do Express QR (React + Vite + TypeScript), executado com [Bun](https://bun.sh) (>= 1.4).

```bash
bun install          # instalar dependências
bun run dev          # servidor de desenvolvimento
bun run build        # typecheck + build de produção (dist/)
bun run preview      # servir o build localmente
bun run lint         # eslint
bun run typecheck    # tsc
```

## Variáveis de ambiente

Copiar `.env.example` para `.env.local`. Na Vercel, definir em **Settings → Environment Variables**:

- `VITE_API_URL`: URL da API (Render). Sem ela o frontend usa a API de produção por omissão.
- `VITE_GOOGLE_CLIENT_ID`: client ID OAuth da Google (público; o secret nunca vai para o frontend).

Guia completo de deploy: `express_qr_backend/docs/deploy.md`.
