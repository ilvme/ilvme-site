import { glob } from 'astro/loaders'
import { z, defineCollection } from 'astro:content'

const essays = defineCollection({
  loader: glob({ base: './src/content/posts/essays', pattern: '**/*.{md,mdx}' }),
  // schema: z.object({
  //   title: z.string(),
  //   type: z.string(),
  //   slug: z.string(),
  //   published: z.boolean(),
  //   date: z.date(),
  //   description: z.union([z.string(), z.undefined(), z.null()]),
  //   tags: z.array(z.string()),
  //   category: z.string(),
  // }),
})

const codeNotes = defineCollection({
  loader: glob({ base: './src/content/posts/code', pattern: '**/*.{md,mdx}' }),
})

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
})

export const collections = { essays, codeNotes, posts }
