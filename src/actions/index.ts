import { defineAction } from 'astro:actions'
import { fetchAllWords } from '../../scripts/words-fetcher.ts'

export const server = {
  fetchAllWords: defineAction({
    handler: async () => {
      return await fetchAllWords()
    },
  }),
}
