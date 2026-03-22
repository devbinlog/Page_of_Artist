import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.warn('[proxy] error:', err.message)
          })
        },
      },
      // Apple Music CDN proxy — strips CORS restriction so Three.js can load album art
      '/imgproxy': {
        target: 'https://is1-ssl.mzstatic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/imgproxy/, ''),
      },
    },
    watch: {
      // 사용하지 않는 대용량 파일 — 파일 감시에서 제외
      ignored: ['**/public/2D.png', '**/public/3d.png'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'r3f-vendor': ['@react-three/fiber', '@react-three/drei'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
