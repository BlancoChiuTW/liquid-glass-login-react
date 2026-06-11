import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/liquid-glass-login-react/',
  plugins: [react(), tailwindcss()],
})
