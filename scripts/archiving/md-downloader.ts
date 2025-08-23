import { NotionConverter } from 'notion-to-md'
import { DefaultExporter } from 'notion-to-md/plugins/exporter'
import path from 'node:path'
import { MdxRendererCustomizer } from './mdx-renderer-customizer.ts'
import { notion } from './notion-fetcher.ts'
import type { PostMeta } from './types.ts'

export async function convertWithMedia(postMeta: PostMeta, outputDir: string = 'src/content_for_test') {
  try {
    const { notion_page_id: pageId, slug, title } = postMeta

    const realPath = path.join(outputDir, slug) // 每个文章单独一个文件夹，md 文件与图片均存于此目录

    const n2m = new NotionConverter(notion)
      // 自定义渲染器
      .withRenderer(new MdxRendererCustomizer({}, postMeta))
      // 配置 fetcher
      .configureFetcher({
        fetchPageProperties: false, // 是否查询 page properties
        fetchComments: false, // 禁止加载评论
        maxRequestsPerSecond: 3, // 控制 API 速率限制，以防止达到 Notion 的限制。默认值 3 是安全的，但你可以根据 API 层进行调整
        batchSize: 10, // 并行处理的块数。值越大性能越高，但内存使用率越高。默认值为 3,
      })
      // 配置导出器
      .withExporter(
        new DefaultExporter({
          outputType: 'file',
          outputPath: path.join(realPath, `index.mdx`),
        })
      )
      // 配置媒体下载
      .downloadMediaTo({
        outputDir: realPath,
        // Update the links in markdown to point to the local media path
        transformPath: (localPath) => `./${path.basename(localPath)}`,
        // 当为 true 时，不从外部来源 (非 Notion URL) 下载媒体。在输出中保留原始 URL。默认为 false
        preserveExternalUrls: false,
        // 媒体下载的选项，排除 database_property，只下载 block 和 page_property 里的 media
        enableFor: ['block', 'page_property'],
      })

    await n2m.convert(pageId)

    console.log(`✓ 转换 ${title} 成功： ${realPath}/index.md`)
  } catch (error) {
    console.error('转换失败:', error)
  }
}
