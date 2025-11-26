import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.auth': {
        target: 'https://finans.azurewebsites.net',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost'
      }
    }
  }
})
