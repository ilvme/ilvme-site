import type { Word } from './types.ts'
import SiteConfig from '../ilvme.config.ts'
import { Client } from '@notionhq/client'

export const notion = new Client({
  auth: import.meta.env.NOTION_TOKEN,
})

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

// 获取所有发布的说说
async function listWords(databaseId: string): Promise<Word[]> {
  const allPages = await listAllPages(databaseId, {
    sorts: [{ property: 'PublishAt', direction: 'descending' }],
  })

  return allPages.map((item) => {
    return {
      id: item.id,
      // @ts-ignore
      title: item.properties.Title.title[0]?.plain_text,
      // @ts-ignore
      time: item.properties.PublishAt.formula.date.start,
      // content: item.properties.Title.title[0]?.plain_text || '这条说说内容去火星啦~',
    }
  })
}

// 获取指定数据库下所有页面，支持自定义查询参数
async function listAllPages(databaseId: string, options?: { filter?: any; sorts?: any; pageSize?: number }) {
  try {
    const allPages = []
    let nextCursor: string | undefined

    do {
      const response = await notion.databases.query({
        database_id: databaseId,
        page_size: options?.pageSize || 100,
        start_cursor: nextCursor,
        filter: options?.filter,
        sorts: options?.sorts,
      })

      // console.log('原始数据', response)

      allPages.push(...response.results)
      nextCursor = response.next_cursor || undefined
    } while (nextCursor)

    console.log(`获取所有页面完成，总数：${allPages.length}`)
    return allPages
  } catch (error) {
    console.error('Error fetching all pages:', error)
    throw error
  }
}
