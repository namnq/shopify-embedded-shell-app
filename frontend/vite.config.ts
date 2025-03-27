import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 54465,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Security-Policy": "frame-ancestors 'self' https://*.myshopify.com https://admin.shopify.com;"
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:59715',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  define: {
    'process.env.SHOPIFY_API_KEY': JSON.stringify(process.env.VITE_SHOPIFY_API_KEY),
  }
})
