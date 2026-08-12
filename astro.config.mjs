// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://avtovakum.uz',
  integrations: [sitemap()],
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
