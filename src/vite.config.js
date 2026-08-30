import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind 0.0.0.0, not localhost: loopback inside a container means the
    // container itself, and the published port would forward to nothing.
    host: true,
    port: 5173,
    strictPort: true,
  },
})
