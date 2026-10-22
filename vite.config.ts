import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import tailwindcss from "@tailwindcss/vite";

/**
 * Production builds must know the API host: without VITE_API_URL the bundle
 * would ship with an empty base URL and every request would hit the static host.
 * Dev (`vite`) and non-production modes are unaffected; the e2e build passes
 * VITE_API_URL=http://api.test.
 */
function requireApiUrl(): Plugin {
  return {
    name: 'expressqr:require-api-url',
    apply: 'build',
    configResolved(config) {
      if (config.mode !== 'production') return;
      const apiUrl = String(config.env.VITE_API_URL ?? '').trim();
      if (!apiUrl) {
        throw new Error(
          '[expressqr] VITE_API_URL is required for production builds. ' +
            'Set it in the environment (e.g. Vercel project settings) or in .env.production.local, ' +
            'e.g. VITE_API_URL=https://api.example.com bun run build',
        );
      }
      if (!/^https?:\/\//.test(apiUrl)) {
        throw new Error(`[expressqr] VITE_API_URL must be an absolute http(s) URL, got "${apiUrl}".`);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    requireApiUrl(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // The 3D stack lives in one chunk that only HomeBackground (lazy) pulls in.
          if (/node_modules\/(three|three-stdlib|maath|@react-three|@react-spring|@shadergradient)\//.test(id)) {
            return 'vendor-three';
          }
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler|use-sync-external-store|zustand|react-redux|@reduxjs|redux|reselect|immer)\//.test(id)) {
            return 'vendor-react';
          }
          if (/node_modules\/@radix-ui\//.test(id)) {
            return 'vendor-radix';
          }
          return undefined;
        },
      },
    },
  },
});
