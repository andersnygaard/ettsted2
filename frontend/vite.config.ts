import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@finans/components': path.resolve(__dirname, '../components/src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
    watch: {
      // Watch components workspace for changes
      ignored: ['!**/components/src/**']
    }
  },
  optimizeDeps: {
    // Don't pre-bundle components so changes are picked up immediately
    exclude: ['@finans/components']
  }
})
