import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O proxy abaixo redireciona /api -> http://localhost:8080/api
// Assim o front não precisa de CORS configurado no backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
