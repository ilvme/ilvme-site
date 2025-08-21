import { listWords } from './notion-fetcher.ts'
import type { Word } from './types.ts'
import SiteConfig from '../src/ilvme.config.ts'

export let cacheWords: Word[] = []
let words_last_fetched_time: number = 0
const expireTime = (SiteConfig.words_fetch_interval < 5 * 60 ? 5 * 60 * 1000 : SiteConfig.words_fetch_interval) * 1000 // 单位：毫秒

export async function fetchAllWords(): Promise<Word[]> {
  // 缓存无效
  if (cacheWords.length === 0 || Date.now() - words_last_fetched_time > expireTime) {
    console.log('缓存无效，获取最新 words')
    cacheWords = await listWords(import.meta.env.NOTION_WORD_DATABASE_ID as string)
    words_last_fetched_time = Date.now()
    return cacheWords
  }

  console.log('缓存有效，直接返回缓存')
  return cacheWords
}
