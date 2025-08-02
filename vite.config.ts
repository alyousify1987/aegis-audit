// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      clientPort: 5173,
    },
    // --- THIS IS THE FIX FOR HOT RELOAD ---
    // This tells Vite to use polling, which is more reliable
    // for detecting file changes inside a Docker container.
    watch: {
      usePolling: true,
    },
  },
})