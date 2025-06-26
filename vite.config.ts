import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/bonkscreener': {
        target: 'https://launch-mint-v1.raydium.io',
        changeOrigin: true,
        rewrite: (path) =>
          '/get/list?platformId=FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1,BuM6KDpWiTcxvrpXywWFiw45R2RNH8WURdvqoTDV1BW4&sort=new&size=100&mintType=default&includeNsfw=false',
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
