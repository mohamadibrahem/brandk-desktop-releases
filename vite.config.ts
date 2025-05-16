import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
  plugins: [
    vue(),
],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  server: {
    port: 3000   // يمكنك تغييره أو حذفه لاستخدام الافتراضي 5173
  }
});
