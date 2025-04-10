import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 外部からのアクセスを許可
    port: 3000, // 使用するポート番号
    watch: {
      usePolling: true,
      interval: 1000
    },
  },
  logLevel: 'info',
})
