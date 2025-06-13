import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, './src/app/ui/lib/'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@ui8kit/ui': path.resolve(__dirname, './src/app/ui8kit/get-ui.tsx'),
      '@ui8kit/components': path.resolve(__dirname, './src/app/ui8kit/get-components.tsx'),
      '@ui8kit/blocks': path.resolve(__dirname, './src/app/ui8kit/get-blocks.tsx')
    }
  },
  build: {
    outDir: 'dist'
  }
}) 