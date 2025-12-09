import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // PERFORMANCE: Build optimizations
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2015',

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Source maps for production debugging (external files)
    sourcemap: true,

    // Rollup options for bundle optimization
    rollupOptions: {
      output: {
        // PERFORMANCE: Manual chunking strategy for optimal caching
        manualChunks: (id) => {
          // Vendor chunks - separate large libraries
          if (id.includes('node_modules')) {
            // React ecosystem in one chunk
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }

            // Mapbox (large library) in its own chunk
            if (id.includes('mapbox')) {
              return 'vendor-mapbox';
            }

            // Framer Motion (animations) in its own chunk
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }

            // Socket.io in its own chunk
            if (id.includes('socket.io')) {
              return 'vendor-socket';
            }

            // Lucide icons in its own chunk
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }

            // All other vendor libraries
            return 'vendor-misc';
          }
        },

        // Asset file names for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }

          return `assets/${extType}/[name]-[hash][extname]`;
        },

        // Chunk file names with hash for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,

    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },

  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },

  // Preview configuration
  preview: {
    port: 4173,
    strictPort: false,
  },
})
