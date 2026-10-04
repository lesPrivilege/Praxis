import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The web app only knows /api. Point API_TARGET at another backend that serves
// contracts/openapi.yaml to replace the fake one.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5180,
    strictPort: true,
    proxy: { '/api': process.env.API_TARGET ?? 'http://127.0.0.1:8787' },
  },
});
