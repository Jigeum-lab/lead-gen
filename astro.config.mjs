// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import { fileURLToPath } from 'node:url';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 프로덕션 도메인 — canonical·sitemap 기준. 배포 도메인 변경 시 여기만 교체.
  site: 'https://lead-gen.team',

  // 링크 hover 시 프리페치 → 페이지 전환 체감 속도 향상(View Transitions와 함께)
  prefetch: { prefetchAll: true },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  },

  integrations: [
    react(),
    // /ui(내부 디자인 시스템)는 색인 제외
    sitemap({ filter: (page) => !page.includes('/ui') })
  ]
});