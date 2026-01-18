import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: mode === 'production' ? '/urban-survival-simulation/' : '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      build: {
        target: 'es2015', // 更好的浏览器兼容性，支持微信浏览器
        minify: 'esbuild', // 使用 esbuild（Vite 默认，更快且无需额外依赖）
        cssCodeSplit: false, // 合并 CSS 文件，减少请求
        rollupOptions: {
          output: {
            manualChunks: undefined, // 单文件输出，减少加载复杂度
          }
        }
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
