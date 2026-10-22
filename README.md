# express_qr_frontend

Frontend do ExpressQR (React + Vite + TypeScript), executado com [Bun](https://bun.sh) (>= 1.4).

```bash
bun install          # instalar dependências
bun run dev          # servidor de desenvolvimento
bun run build        # typecheck + build de produção (dist/); exige VITE_API_URL
bun run preview      # servir o build localmente
bun run lint         # eslint
bun run typecheck    # tsc
```

## Variáveis de ambiente

Copiar `.env.example` para `.env.local`. Na Vercel, definir em **Settings → Environment Variables**:

- `VITE_API_URL`: URL da API (Render). Obrigatória em produção: `vite build` falha com uma mensagem clara se faltar (plugin em `vite.config.ts`). Localmente: `VITE_API_URL=http://localhost:8080 bun run build` ou um `.env.production.local`. Em desenvolvimento (`bun run dev`) o padrão é `http://localhost:8080`.
- `VITE_GOOGLE_CLIENT_ID`: client ID OAuth da Google (público; o secret nunca vai para o frontend).

## Cabeçalhos de segurança (Vercel)

`vercel.json` aplica a todas as rotas (além do rewrite SPA para `index.html`):

| Cabeçalho | Valor / motivo |
|---|---|
| `Content-Security-Policy` | ver abaixo |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` (redundante com `frame-ancestors`, para browsers antigos) |

Directivas da CSP:

- `default-src 'self'`
- `script-src 'self' 'sha256-…' https://accounts.google.com/gsi/client`: o hash autoriza **apenas** o script inline anti-flash do tema em `index.html`; o resto é o bundle e o script do Google Sign-In.
- `style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style`: o Sonner e os componentes Radix injectam estilos em runtime.
- `img-src 'self' data: blob: https:`: QR em data URL, downloads em blob e imagens servidas pela API.
- `font-src 'self' data:`: as fontes são locais (`src/assets/fonts`).
- `connect-src 'self' https:`: o host da API muda por ambiente; inclui também os HDR do fundo da home (`ruucm.github.io`).
- `frame-src https://accounts.google.com` (popup/iframe do Google), `worker-src 'self' blob:`.
- `object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`.

**Se editar o script inline de `index.html`** (qualquer carácter, incluindo espaços), recalcule o hash e actualize-o em `vercel.json`:

```bash
python3 -c "import re,hashlib,base64;s=open('index.html').read();m=re.search(r'<script>(.*?)</script>',s,re.S);print('sha256-'+base64.b64encode(hashlib.sha256(m.group(1).encode()).digest()).decode())"
```

O `vite preview` não aplica os cabeçalhos da Vercel; para validar localmente, copie a política para um `<meta http-equiv="Content-Security-Policy">` numa cópia do `dist/index.html` (sem `frame-ancestors`, que não funciona em meta) e procure violações na consola. Depois do deploy: `curl -sI https://<domínio> | grep -i content-security`.

Guia completo de deploy: `express_qr_backend/docs/deploy.md`.
