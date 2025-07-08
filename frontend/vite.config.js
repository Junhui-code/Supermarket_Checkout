import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './',  
  build: {
    outDir: 'dist',  
    emptyOutDir: true,
    rollupOptions: {
      input: './public/index.html'
    }
  },
  publicDir: 'public',  
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})