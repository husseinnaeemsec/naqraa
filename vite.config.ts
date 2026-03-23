import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src')
      }
    },
    server: {
      allowedHosts: env.VITE_ALLOWED_HOSTS ? env.VITE_ALLOWED_HOSTS.split(',') : [],
      port: Number(env.VITE_DEV_PORT) || 5173,
      host: env.VITE_HOST || 'localhost', // Allow external connections
      strictPort: true,
      // Remove HTTPS for local dev
    },
    preview: {
      port: Number(env.VITE_PREVIEW_PORT) || 4173,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['framer-motion', 'lucide-react'],
            utils: ['axios', 'i18next', 'react-i18next'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    define: {
      // Make env variables available at build time
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __MODE__: JSON.stringify(mode),
    },
    // Environment variable prefix
    envPrefix: 'VITE_',
  }
})
