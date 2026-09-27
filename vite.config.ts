import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { otpApiPlugin } from './server/otpPlugin.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), otpApiPlugin()],
  server: {
    port: 5181,
    host: '127.0.0.1',
  },
})
