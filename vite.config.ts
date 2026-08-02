import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2018',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // esbuild minify (no extra terser dependency on Hostinger CI / local)
    minify: 'esbuild',
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    compress: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4242',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
  css: {
    devSourcemap: false,
  },
});