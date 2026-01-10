import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      jit: true,
      tsconfig: './tsconfig.json'
    })
  ],
  build: {
    outDir: 'dist/uttarandhra-tirupati',
    emptyOutDir: true,
    target: 'es2020'
  },
  resolve: {
    mainFields: ['module']
  }
});