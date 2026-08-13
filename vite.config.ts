import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Exclude large media files from the watcher to prevent EBUSY on Windows
      ignored: ['**/*.mp4', '**/*.webm', '**/*.mov'],
    },
  },
})
