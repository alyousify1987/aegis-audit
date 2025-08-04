// vite.config.ts

import { defineConfig } from 'vite';
import type { ViteDevServer, Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import react from '@vitejs/plugin-react';

// Vite plugin to set correct Content-Type for .onnx and .wasm files
function staticMimeTypePlugin(): Plugin {
  return {
    name: 'static-mime-type',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url) {
          if (req.url.endsWith('.onnx')) {
            res.setHeader('Content-Type', 'application/octet-stream');
          } else if (req.url.endsWith('.wasm')) {
            res.setHeader('Content-Type', 'application/wasm');
          }
        }
        next();
      });
    },
  };
}
export default defineConfig({
  plugins: [react(), staticMimeTypePlugin()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      clientPort: 5173,
    },
    watch: {
      usePolling: true,
    },
  },
});