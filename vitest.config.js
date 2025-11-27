import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '*.config.js',
        'src/main.jsx',
      ],
    },
  },
  resolve: {
    alias: {
      '#components': path.resolve(__dirname, './src/components'),
      '#windows': path.resolve(__dirname, './src/windows'),
      '#constants': path.resolve(__dirname, './src/constants'),
      '#store': path.resolve(__dirname, './src/store'),
      '#hoc': path.resolve(__dirname, './src/hoc'),
    },
  },
});