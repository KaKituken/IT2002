import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import Pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Pages({
      pagesDir: 'pages',
      extensions: ['html'],
      exclude: ['**/layouts/*.html']
    })
  ],
  build: {
    rollupOptions: {
      input: {
        // main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        signIn: resolve(__dirname, 'sign-in.html'),
        provider: resolve(__dirname, 'provider.html'),
        display: resolve(__dirname, 'display.html'),
        welcome: resolve(__dirname, 'welcome.html')
      },
    },
  },
  server: {
    host: 'localhost',
    port: 3000, // 可以自行指定端口号
  },
})
