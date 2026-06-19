import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['socket.io-client'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor';
            if (id.includes('framer-motion') || id.includes('antd')) return 'ui';
            if (id.includes('@tanstack')) return 'query';
            if (id.includes('react-icons')) return 'icons';
            if (id.includes('gsap')) return 'gsap';
            if (id.includes('leaflet')) return 'maps';
            if (id.includes('socket.io') || id.includes('engine.io')) return 'socket';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
