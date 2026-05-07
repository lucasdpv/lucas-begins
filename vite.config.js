import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase em um chunk separado — raramente muda, fica no cache do browser
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Framer Motion em chunk separado pela mesma razão
          'vendor-motion': ['framer-motion'],
          // React core em chunk separado
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
