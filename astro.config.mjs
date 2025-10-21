import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
import mdx from '@astrojs/mdx'

// https://astro.build/config
export default defineConfig({
  site: 'https://ikangjia.cn',

  // output: 'static',
  // integrations: [],

  server: {
    port: 4321,
  },

  vite: { plugins: [tailwindcss()] },

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      // theme: 'vitesse-black',
    },
  },

  adapter: vercel(),
  integrations: [mdx()],
})
