export interface PostMeta {
  title: string
  type: string
  status: string
  slug: string

  category: string
  tags: string[]
  date: string
  summary?: string

  last_edited_time: string
  blog_last_fetched_time: string | null
  notion_page_id: string
  icon?: string
}
