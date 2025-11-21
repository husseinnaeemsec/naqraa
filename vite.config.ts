import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from "path"
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src')
      }
    },
    server: {
      allowedHosts: ['naqraa', 'localhost', '127.0.0.1'],
      port: 3000,
      host: '0.0.0.0', // Allow external connections
      strictPort: true,
      https:{
            key: fs.readFileSync('/home/hussein/ssl/naqraa.key'),
            cert: fs.readFileSync('/home/hussein/ssl/naqraa.crt'),
      }
    },
    preview: {
      port: 4173,
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
