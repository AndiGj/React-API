import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
   build: {
    // Use terser and turn off mangling/compress to avoid scope issues
    minify: 'terser',
    terserOptions: {
      mangle: false,
      compress: false,
      keep_fnames: true,
      keep_classnames: true
    }
  },
  optimizeDeps: {
    // Avoid pre-bundling these dynamic-eval libs
    exclude: ['protodef', 'prismarine-nbt']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    },
  },
})
