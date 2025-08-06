import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://api.studywith.site:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})