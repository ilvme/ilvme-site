// 1. 获取指定 database 下所有 page，解析 page 的属性
// 2. 遍历 page

import { NotionConverter } from 'notion-to-md'
import { DefaultExporter } from 'notion-to-md/plugins/exporter'
import path from 'node:path'
import { CustomMDXRenderer } from './CustomMDXRenderer.ts'
import { notion } from './support.ts'
import type { PostMeta } from '../types.ts'

// const pageId = '1cfc485ef35680c88b8ee24215573da3'
// const outputDir = './content/output' // For markdown file

export async function convertWithMedia(postMeta: PostMeta, outputDir: string = './output') {
  try {
    const { notion_page_id: pageId, title, slug } = postMeta
    // 每个文章单独一个文件夹，md 文件与图片均存于此目录
    const realPath = path.join(outputDir, slug) // For downloaded media

    const exporter = new DefaultExporter({
      outputType: 'file',
      outputPath: path.join(realPath, `index.md`),
    })

    const n2m = new NotionConverter(notion)
      .withRenderer(new CustomMDXRenderer())
      .configureFetcher({
        fetchPageProperties: true,
        fetchComments: false, // 禁止加载评论
        maxRequestsPerSecond: 3, // 控制 API 速率限制，以防止达到 Notion 的限制。默认值 3 是安全的，但你可以根据 API 层进行调整
        batchSize: 10, // 并行处理的块数。值越大性能越高，但内存使用率越高。默认值为 3,
      })
      .withExporter(exporter)
    // 配置媒体下载
    // .downloadMediaTo({
    //   outputDir: realPath,
    //   // Update the links in markdown to point to the local media path
    //   transformPath: (localPath) => `./${path.basename(localPath)}`,
    // })

    await n2m.convert(pageId)

    console.log(`✓ 转换 page 为： ${realPath}/index.md`)
    console.log(`✓ 图片已下载到：${realPath}`)
  } catch (error) {
    console.error('转换失败:', error)
  }
}

export async function convertPage() {
  try {
    const pageId = '1cfc485ef35680c88b8ee24215573da3' // Replace with your actual page ID

    // Create a NotionConverter instance
    const n2m = new NotionConverter(notion).withRenderer(new CustomMDXRenderer())

    // Convert the page
    const result = await n2m.convert(pageId)

    // The result object also contains block data, page properties, etc.
    console.log('--- Conversion Result Object ---')
    console.log(result)
  } catch (error) {
    console.error('Conversion failed:', error)
  }
}

export async function convertAndSavePage() {
  try {
    const pageId = '1cfc485ef35680c88b8ee24215573da3'
    const outputDir = './output' // Define where to save the file

    // Configure the DefaultExporter to save to a file
    const exporter = new DefaultExporter({
      outputType: 'file',
      outputPath: path.join(outputDir, `${pageId}.md`),
    })

    // Create the converter and attach the exporter
    const n2m = new NotionConverter(notion).withExporter(exporter)

    // Convert the page (the exporter handles saving)
    await n2m.convert(pageId)

    console.log(`✓ Successfully converted page and saved to ${outputDir}/${pageId}.md`)
  } catch (error) {
    console.error('Conversion failed:', error)
  }
}
