
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/loki-downloader-app/', // Replace 'loki-downloader-app' with your GitHub repository name
})
