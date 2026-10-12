import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'dist',
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) {
            return 'three-core'
          }
          if (id.includes('node_modules/@react-three/')) {
            return 'r3f-vendor'
          }
          if (id.includes('node_modules/postprocessing/')) {
            return 'postprocessing-vendor'
          }
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    watch: {
      ignored: [
        '**/favicon_io*/**',
        '**/.old-portfolio-ref/**',
        '**/source-frames*/**',
        '**/.git/**',
        '**/*.ttf',
        '**/*.woff2',
        '**/*.glb',
        '**/RuinedSerif*',
      ],
    },
  },
})
