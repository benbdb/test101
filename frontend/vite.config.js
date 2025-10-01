import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/callback': 'http://localhost:3000',
      '/me': 'http://localhost:3000',
      '/upload-video': 'http://localhost:3000',
      '/transcode': 'http://localhost:3000',
      '/download-video': 'http://localhost:3000',
      '/list-videos': 'http://localhost:3000'
    }
  }
})
