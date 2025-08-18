// import { Client } from '@notionhq/client'
// import { NotionToMarkdown } from 'notion-to-md'
// import { type Word } from './types'
// import SiteConfig from '../ilvme.config.ts'
//
// export const notion = new Client({ auth: process.env.NOTION_TOKEN })
// export const n2m = new NotionToMarkdown({ notionClient: notion })
//
// // 缓存机制
// let wordsCache: Word[] | null = null
// let cacheTime: number = 0
// const CACHE_DURATION = 30 * 60 * 1000 // 30分钟缓存
//
// function isCacheValid(): boolean {
//   return wordsCache !== null && Date.now() - cacheTime < CACHE_DURATION
// }
//
// // 获取所有发布的说说
// export async function listWords(databaseId: string) {
//   // 检查缓存
//   if (isCacheValid() && wordsCache) {
//     return wordsCache
//   }
//
//   const allPages = await listAllPages(databaseId, {
//     sorts: [{ property: 'PublishAt', direction: 'descending' }],
//   })
//
//   const allWords = allPages.map((item) => {
//     return {
//       id: item.id,
//       content: item.properties.Title.title[0]?.plain_text || '这条说说内容去火星啦~',
//       time: item.properties.PublishAt.formula.date.start,
//     }
//   }) as Word[]
//
//   // 更新缓存
//   wordsCache = allWords
//   cacheTime = Date.now()
//
//   return allWords
// }
//
// // 获取指定数据库下所有页面，支持自定义查询参数
// export async function listAllPages(
//   databaseId: string,
//   options?: {
//     filter?: any
//     sorts?: any
//     pageSize?: number
//   }
// ) {
//   try {
//     const allPages = []
//     let hasMore = true
//     let nextCursor: string | null = undefined
//
//     while (hasMore) {
//       const res = await notion.databases.query({
//         database_id: databaseId,
//         page_size: options?.pageSize || 100,
//         start_cursor: nextCursor,
//         filter: options?.filter,
//         sorts: options?.sorts,
//       })
//
//       allPages.push(...res.results)
//
//       hasMore = res.has_more
//       nextCursor = res.next_cursor
//     }
//
//     console.log(`获取所有页面完成，总数：${allPages.length}`)
//     return allPages
//   } catch (error) {
//     console.error('Error fetching all pages:', error)
//     throw error
//   }
// }
//
// // 获取简历
// export async function getResumeStr() {
//   if (!SiteConfig.NOTION_RESUME_PAGE_ID) {
//     return '您尚未配置简历相关信息，请参照 README 文档完善环境变量「NOTION_RESUME_PAGE_ID」'
//   }
//   const mdBlocks = await n2m.pageToMarkdown(SiteConfig.NOTION_RESUME_PAGE_ID)
//   const mdString = n2m.toMarkdownString(mdBlocks)
//
//   return mdString.parent
// }
