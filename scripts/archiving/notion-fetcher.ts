import type { PostMeta } from './types.ts'
import { Client, type PageObjectResponse } from '@notionhq/client'

export const notion = new Client({
  auth: import.meta.env.NOTION_TOKEN,
})

export async function fetchAllPosts(databaseId: string): Promise<PostMeta[]> {
  const posts: PostMeta[] = []
  let startCursor: string | undefined

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: 'status', select: { equals: 'Published' } },
          // { property: 'type', select: { equals: 'Post' } },
        ],
      },
      sorts: [{ property: 'date', direction: 'descending' }],
      start_cursor: startCursor,
    })

    // console.log('原始数据', response)

    const pagePosts = response.results.map((page) => extractPostMeta(page as PageObjectResponse))

    posts.push(...pagePosts)
    startCursor = response.next_cursor || undefined
  } while (startCursor)

  return posts
}

export async function updateLastFetchedTime(pageId: string, lastFetchedTime: string): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      last_fetched_time: {
        date: {
          start: lastFetchedTime,
        },
      },
    },
  })
}

function extractPostMeta(page: PageObjectResponse): PostMeta {
  const properties = page.properties

  return {
    title: parseTextProperty(properties.title),
    type: parseSelectProperty(properties.type),
    status: parseSelectProperty(properties.status),
    slug: parseTextProperty(properties.slug),
    date: parseDateProperty(properties.date),
    summary: parseTextProperty(properties.summary),
    category: parseSelectProperty(properties.category),
    tags: parseMultiSelectProperty(properties.tags),
    icon: parsePageIcon(page),
    cover: parsePageCover(page),

    last_edited_time: page.last_edited_time,
    last_fetched_time: parseDateProperty(properties.last_fetched_time),
    notion_page_id: page.id,
  }
}

const parseTextProperty = (prop: any): string => {
  if (!prop) return ''
  if (prop.type === 'title') {
    return prop.title.map((text: any) => text.plain_text).join('')
  }
  if (prop.type === 'rich_text') {
    return prop.rich_text.map((text: any) => text.plain_text).join('')
  }
  return ''
}

const parseSelectProperty = (prop: any): string => {
  return prop?.select?.name || ''
}

const parseMultiSelectProperty = (prop: any): string[] => {
  return prop?.multi_select?.map((item: any) => item.name) || []
}

const parseDateProperty = (prop: any): string => {
  return prop?.date?.start || ''
}

// 提取页面 emoji 图标
const parsePageIcon = (page: PageObjectResponse): string | undefined => {
  return page.icon?.type === 'emoji' ? (page.icon.emoji as string) : undefined
}

const parsePageCover = (page: PageObjectResponse): string | undefined => {
  return page.cover?.type === 'external' ? (page.cover.external.url as string) : undefined
}
