export interface PostMeta {
  title: string
  description?: string
  date: string
  slug: string
  tags: string[]
  category: string
}

export interface Post extends PostMeta {
  content: string
}
