import { defineConfig } from 'vite'

export default defineConfig({
  // 깃허브용은 확인:  base: '/diagram-vite/',
  base: './',
  build: {
    outDir: 'docs',
    sourcemap: false, // .map 파일생성 안하기(배포용)
    minify: 'esbuild',
  },
  server: {
    port: 5173,
    open: true,
  }
})