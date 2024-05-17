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
});
