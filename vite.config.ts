import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, './src/lib/'),
      '@/hooks': path.resolve(__dirname, './src/hooks/'),
      '@ui8kit': path.resolve(__dirname, './src/app/ui8kit/index.tsx'),
      '@hooks': path.resolve(__dirname, './src/app/ui8kit/hooks')
    }
  },
  build: {
    outDir: 'dist'
  }
}) 