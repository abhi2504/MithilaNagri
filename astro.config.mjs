// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Mithila Encyclopedia — trilingual static site.
// Languages: en (default), hi (Hindi/Devanagari), mai (Maithili/Devanagari + Tirhuta accents).
export default defineConfig({
  site: 'https://mithilanagri.in',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hi', 'mai'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [react(), mdx(), sitemap()],
  prefetch: {
    defaultStrategy: 'viewport',
  },
});
