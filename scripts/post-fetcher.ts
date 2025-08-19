import fs from 'fs'
import path from 'path'
import { fetchAllPosts, updateLastFetchedTime } from './notion-fetcher.ts'
import { convertWithMedia } from './md-downloader.ts'

export async function fetchAndSavePosts(
  notionDatabaseId = import.meta.env.NOTION_DATABASE_ID as string,
  outputDir = 'src/content-test/posts' as string
): Promise<void> {
  try {
    // 获取所有文章，并筛选需要更新的文章
    const allPosts = await fetchAllPosts(notionDatabaseId)
    const needUpdatePosts = allPosts.filter((post) => {
      // 如果没有 last_fetched_time，说明从未拉取过，需要更新
      if (!post.last_fetched_time) {
        return true
      }

      // 检查本地文件是否还存在，如果本地文件不存在，需要更新
      const localDirPath = path.join(outputDir, `${post.slug}`)
      if (!fs.existsSync(localDirPath) || !fs.existsSync(path.join(localDirPath, 'index.mdx'))) {
        return true
      }

      // 比较最后编辑时间和最后拉取时间，若晚于需要更新
      return new Date(post.last_edited_time) > new Date(post.last_fetched_time)
    })

    // 如果没有需要更新的文章，则返回
    if (needUpdatePosts.length === 0) {
      return
    }

    // 批量处理更新
    for (const post of needUpdatePosts) {
      const fetchTime = new Date().toISOString()
      // 更新 Notion 中的 last_fetched_time
      await updateLastFetchedTime(post.notion_page_id, fetchTime)

      // 拉取并保存 Markdown 文件
      await convertWithMedia({ ...post, last_fetched_time: fetchTime }, outputDir)
    }
  } catch (error) {
    throw error
  }
}
