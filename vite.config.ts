import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/fonts/Tajawal-Regular.ttf',
          dest: 'assets/fonts'
        }
      ]
    })
],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  server: {
    port: 3000   // يمكنك تغييره أو حذفه لاستخدام الافتراضي 5173
  }
});
