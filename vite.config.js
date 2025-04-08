import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// For proper ESM support with __dirname
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Ensure JSX runtime is properly handled
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      babel: {
        plugins: [
          // Add any Babel plugins if needed
        ],
        // This is important to handle JSX runtime correctly
        babelrc: false,
        configFile: false,
      }
    })
  ],
  base: '/',
  optimizeDeps: {
    // Pre-bundle these dependencies to avoid vite:import-analysis issues
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-router-dom',
      '@react-oauth/google'
    ],
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
    // Generate sourcemaps for debugging on Netlify
    sourcemap: true,
    // Generate a manifest file for server routing
    manifest: true,
    // Ensure CSS has correct MIME type
    cssCodeSplit: true,
    cssMinify: true,
    // Force inlining of jsx-runtime helpers
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    // Configure how modules are generated
    modulePreload: {
      polyfill: true,
    },
    // Ensure production builds work on Netlify
    rollupOptions: {
      output: {
        // Ensure proper chunking for optimal loading
        manualChunks: {
          vendor: ['react', 'react-dom', 'react/jsx-runtime', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
          auth: ['@react-oauth/google', 'jwt-decode'],
        },
        // Force scripts to use correct MIME types
        format: 'es',
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        client: resolve(__dirname, 'src/client.jsx'),
      },
      output: {
        // Using a function for manualChunks instead of an object to prevent conflicts with
        // external modules (particularly 'react' being both in manualChunks and resolved as external)
        manualChunks: (id) => {
          // Handle vendor chunking properly
          if (id.includes('node_modules')) {
            if (id.includes('react') || 
                id.includes('react-dom') || 
                id.includes('react-router-dom')) {
              return 'vendor';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n';
            }
            if (id.includes('react-hook-form') || 
                id.includes('@hookform/resolvers') || 
                id.includes('yup')) {
              return 'forms';
            }
            if (id.includes('@react-oauth/google') || id.includes('jwt-decode')) {
              return 'auth';
            }
            // Default chunk for other node_modules
            return 'vendor-deps';
          }
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
    // List packages that should not be externalized for SSR
    noExternal: [
      'react-helmet-async', 
      'react-phone-number-input',
      'react/jsx-runtime',
      '@react-oauth/google',
      // Add additional dependencies that cause SSR issues if externalized
    ],
    // Server entry point
    entry: 'src/main.jsx',
    // Target environments
    target: 'node',
    // Formats
    format: ['cjs', 'esm'],
    // Optimize SSR dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime']
    }
  },
})
