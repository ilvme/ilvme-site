import fs from 'fs'
import path from 'path'
import { getAllPosts1 } from './notion-fetcher.ts'
import { convertWithMedia } from './md-downloader.ts'
import type { PostMeta } from './types.ts'

export interface FetcherConfig {
  notionDatabaseId: string
  notionToken: string
  outputDir: string
  forceMode: boolean
}

export interface FetchResult {
  updated: number
  skipped: number
  errors: number
}

export async function main(config: FetcherConfig): Promise<FetchResult> {
  const result: FetchResult = { updated: 0, skipped: 0, errors: 0 }

  try {
    // 获取所有文章
    const allPosts = await getAllPosts1(config.notionDatabaseId)

    console.log(`📚 Found ${allPosts.length} published posts`)

    // 筛选需要更新的文章
    const postsToUpdate = filterPostsToUpdate(allPosts, config)
    console.log(`🔄 Posts to update: ${postsToUpdate.length}`)

    if (postsToUpdate.length === 0 && !config.forceMode) {
      console.log('✅ All posts are up to date!')
      return result
    }

    // 批量处理更新
    for (const post of postsToUpdate) {
      try {
        await processPost(post, config)
        result.updated++
        console.log(`✅ Updated: ${post.title}`)
      } catch (error) {
        result.errors++
        console.error(`❌ Failed to update ${post.title}:`, error)
      }
    }

    console.log(`🎉 Fetch completed! Updated: ${result.updated}, Skipped: ${result.skipped}, Errors: ${result.errors}`)
  } catch (error) {
    console.error('💥 Fatal error during fetch:', error)
    throw error
  }

  return result
}

function filterPostsToUpdate(posts: PostMeta[], config: FetcherConfig): PostMeta[] {
  // 如果是强制模式，返回所有文章
  if (config.forceMode) {
    console.log('🔥 Force mode enabled - will update ALL posts')
    return posts
  }

  return posts.filter((post) => {
    // 检查本地文件是否存在
    const localFilePath = path.join(config.outputDir, `${post.slug}`)
    const fileExists = fs.existsSync(localFilePath)

    // 如果本地文件不存在，肯定需要拉取
    if (!fileExists) {
      console.log(`📥 New post: ${post.title}`)
      return true
    }

    // 如果没有 blog_last_fetched_time，说明从未拉取过，需要更新
    if (!post.blog_last_fetched_time) {
      console.log(`🔄 First time fetch: ${post.title}`)
      return true
    }

    // 比较最后编辑时间和最后拉取时间
    const lastEditTime = new Date(post.last_edited_time)
    const lastFetchTime = new Date(post.blog_last_fetched_time)

    const needsUpdate = lastEditTime > lastFetchTime

    if (needsUpdate) {
      console.log(`🔄 Updated since last fetch: ${post.title}`)
      console.log(`   Last edited: ${post.last_edited_time}`)
      console.log(`   Last fetched: ${post.blog_last_fetched_time}`)
    }

    return needsUpdate
  })
}

async function processPost(post: PostMeta, config: FetcherConfig): Promise<void> {
  try {
    console.log(`📄 Processing post: ${post.title}`)

    const fetchTime = new Date().toISOString()
    // 先更新 Notion 中的 blog_last_fetched_time
    // await updateBlogLastFetchedTime(post.notion_id, fetchTime)

    // 创建更新后的元数据对象（包含当前时间作为 blog_last_fetched_time）
    const updatedPost: PostMeta = {
      ...post,
      blog_last_fetched_time: fetchTime,
    }

    await convertWithMedia(updatedPost, config.outputDir)

    console.log(`✅ Successfully processed: ${post.title}`)
  } catch (error) {
    console.error(`❌ Error processing post ${post.title}:`, error)
    throw error
  }
}
