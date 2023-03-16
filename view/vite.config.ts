import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        signIn: resolve(__dirname, 'sign-in.html'),
        provider: resolve(__dirname, 'provider.html'),
        display: resolve(__dirname, 'display.html')
      },
    },
  }
})
