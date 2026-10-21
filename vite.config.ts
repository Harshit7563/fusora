import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { otpApiPlugin } from './server/otpPlugin.js'
import { ordersApiPlugin } from './server/ordersPlugin.js'
import { razorpayApiPlugin } from './server/razorpayPlugin.js'
import { sellerApiPlugin } from './server/sellerPlugin.js'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    otpApiPlugin(),
    sellerApiPlugin(),
    razorpayApiPlugin(),
    ordersApiPlugin(),
  ],
  server: {
    port: 5181,
    host: '127.0.0.1',
  },
})
