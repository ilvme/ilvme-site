import rss from '@astrojs/rss'
import { getAllPosts } from '../libs/content-loader.ts'

export async function GET(context) {
  const posts = await getAllPosts()
  return rss({
    // 输出的 xml 中的`<title>`字段
    title: '林深时觉寒的网站',
    // 输出的 xml 中的`<description>`字段
    description: 'A humble Astronaut’s guide to the stars',
    // 从端点上下文获取项目“site”
    // https://docs.astro.build/zh-cn/reference/api-reference/#site
    site: context.site,
    // 输出的 xml 中的`<item>`数组
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      // 计算 RSS 链接
      link: `/posts/${post.data.slug}/`,
    })),
    stylesheet: '/pretty-feed-v3.xsl',
    // (可选) 注入自定义 xml
    // customData: `<language>en-us</language>`,
  })
}
