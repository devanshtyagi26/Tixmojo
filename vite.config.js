import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: true,
    sourcemap: false,
    // Generate a manifest file for server routing
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        client: resolve(__dirname, 'src/client.jsx'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
          auth: ['@react-oauth/google', 'jwt-decode'],
        },
      },
    },
    // Generate SSR-compatible build
    ssr: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  // SSR specific options
  ssr: {
    // Enable Node.js polyfills for SSR
    noExternal: ['react-helmet-async', 'react-phone-number-input'],
    // Server entry point
    entry: 'src/main.jsx',
    // Target environments
    target: 'node',
    // Formats
    format: ['cjs', 'esm'],
  },
})
