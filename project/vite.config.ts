import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://vvmpxddcehyjmnxgqyqq.supabase.co/functions/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      },
      '/hn-api': {
        target: 'https://hacker-news.firebaseio.com/v0',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hn-api/, ''),
        secure: false
      }
    }
  }
});