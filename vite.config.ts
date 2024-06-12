/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
  },
  plugins: [
    react({
      babel: {
        plugins: ['@emotion'],
      },
    }),
    UnoCSS(),
    tsconfigPaths(),
  ],

  server: {
    cors: true,
    proxy: {
      '/api': {
        // target: 'http://service.aicloud.fit:9528',
        target: 'https://vhost.aidigitalfield.com',
        changeOrigin: true,

        // rewrite: (path) => path.replace(/^\/api/, '/api/'),

        configure: (proxy, options) => {
          // console.log('AT-[ proxy &&&&&********** ]', proxy);

          proxy.on('error', (error) => {
            console.log('AT-[ error &&&&&********** ]', error);
          });

          console.log('AT-[ options &&&&&********** ]', options);
          // proxy 是 'http-proxy' 的实例
        },
      },
    },
  },
});
