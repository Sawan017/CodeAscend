import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: ['**/*.mp4', '**/*.webm', '**/*.mov'],
    },
  },
})
