import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.erssoft.co.uk',
  output: 'static',

  build: {
    format: 'directory',
  },

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/thankyou/') &&
        !page.includes('/tiktok-review/'),
    }),
  ],
});