import { defineConfig } from 'vite'

export default defineConfig({
  // 깃허브용은 확인:  base: '/diagram-vite/',
  base: './',
  build: {
    outDir: 'docs',
    sourcemap: false, // .map 파일생성 안하기(배포용)
    minify: 'esbuild', // false: 압축안함, terser: 엄청난 압축. consele.log drop안됨. 빌드느림
  },
  server: {
    port: 5173,
    open: true,
  }
})