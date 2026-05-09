import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor';
            if (id.includes('framer-motion') || id.includes('antd')) return 'ui';
            if (id.includes('@tanstack')) return 'query';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
