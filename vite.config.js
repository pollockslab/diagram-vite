import { defineConfig } from 'vite'

export default defineConfig({
  // 깃허브용은 확인:  base: '/diagram-vite/',
  base: './',
  build: {
    outDir: 'docs',
  },
})