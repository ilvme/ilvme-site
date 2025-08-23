export interface PostMeta {
  title: string // 标题
  type: string //  类型 Post | XXX
  status: string // 状态 Published | Draft | Private
  slug: string // slug
  date: string // 发布时间
  summary?: string // 摘要
  category: string //  分类 Essays | Code
  tags: string[] // 标签
  icon?: string // 图标
  cover?: string // 封面
  readingTime?: number // 阅读时间，单位：秒

  last_edited_time: string // 最后修改时间，取自 Notion
  last_fetched_time: string | null // 最后抓取时间，取自 Notion
  notion_page_id: string // Notion 页面 ID
}
