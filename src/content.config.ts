import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const essays = defineCollection({
  loader: glob({ base: "./src/content/essays", pattern: "**/*.{md,mdx}" }),
  // schema: z.object({
  //     title: z.string(),
  //     pubDate: z.date(),
  //     description: z.string(),
  //     author: z.string(),
  //     image: z.object({
  //         url: z.string(),
  //         alt: z.string(),
  //     }),
  //     tags: z.array(z.string()),
  // }),
});

export const collections = { essays };