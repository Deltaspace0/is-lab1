import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src/main/js',
  build: {
    outDir: '../../../dist'
  },
  server: {
    proxy: {
      '/person': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/coordinates': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/location': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
