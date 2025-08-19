import { MDXRenderer, type MDXRendererConfig } from 'notion-to-md/plugins/renderer'
import type { PostMeta } from './types.ts'

export class MdxRendererCustomizer extends MDXRenderer {
  private readonly postMeta: PostMeta

  constructor(config: MDXRendererConfig = {}, postMeta: PostMeta) {
    super(config)
    this.postMeta = postMeta

    // Add frontmatter
    this.addVariable('frontmatter', async (name, context) => {
      console.log(`>>> 初始化 ${name}`)
      console.log(context.pageProperties)

      // 可在此进行扩展，比如需要添加阅读时间
      // const props = context.pageProperties
      // const readingTime = calculateReadingTime(context.variableData.get('content'))

      let str = `---`
      Object.entries(this.postMeta).forEach(([key, value]) => {
        if (key === 'tags') {
          str += `\n${key}: [${value.join(', ')}]`
          return
        }

        str += `\n${key}: ${value}`
      })
      str += `\n---`
      return str
    })

    // Custom code blocks with line numbers
    //     this.createBlockTransformer('code', {
    //       transform: async ({ block, utils }) => {
    //         const code = block.code.rich_text[0].plain_text
    //         const lines = code.split('\n').map((line, i) => `<div class="line-number">${i + 1}</div>${line}`)
    //
    //         return `<pre class="with-line-numbers">
    //   <code class="language-${block.code.language}">
    //     ${lines.join('\n')}
    //   </code>
    // </pre>\n\n`
    //       },
    //     })
  }
}
