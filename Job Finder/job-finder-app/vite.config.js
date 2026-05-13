import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/data-sync': {
        target: 'https://n8n.digynex.se',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/data-sync/, '/webhook/neural-bridge')
      }
    }
  }
})
