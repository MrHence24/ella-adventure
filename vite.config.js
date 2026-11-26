import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base path ensures assets load cleanly on GitHub Pages
  // regardless of repository name (e.g. /ella-adventure/ or custom domain).
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
  },
});
