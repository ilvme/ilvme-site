import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
import mdx from '@astrojs/mdx'

import vue from '@astrojs/vue'

// https://astro.build/config
export default defineConfig({
  site: 'https://v4.ikangjia.cn',

  // output: 'static',
  // integrations: [],

  server: {
    port: 4321,
    open: 'friends',
  },

  vite: { plugins: [tailwindcss()] },

  markdown: {
    shikiConfig: {
      themes: {
        // light: 'github-light',
        // dark: 'github-dark',
      },
    },
  },

  adapter: vercel(),
  integrations: [mdx(), vue()],
})
