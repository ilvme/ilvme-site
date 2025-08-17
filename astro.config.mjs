// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  site: 'https://v4.ikangjia.cn',

  // output: 'static',
  // integrations: [],

  server: {
    port: 4321,
    open: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      themes: {
        // light: 'github-light',
        // dark: 'github-dark',
      },
    },
  },

  adapter: vercel(),
})
