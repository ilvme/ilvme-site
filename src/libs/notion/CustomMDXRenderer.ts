import { MDXRenderer, type MDXRendererConfig } from 'notion-to-md/plugins/renderer'
import { getDateProperty, getMultiSelectProperty, getTextProperty } from './support.ts'

export class CustomMDXRenderer extends MDXRenderer {
  constructor(config: MDXRendererConfig = {}) {
    super(config)

    // Custom template with new sections
    //     this.setTemplate(`{{{frontmatter}}}
    // {{{content}}}`)

    this.addVariable('frontmatter', async (_, context) => {
      const props = context.pageProperties
      // const readingTime = calculateReadingTime(context.variableData.get('content'))
      console.log('props', JSON.stringify(props))
      return `---
title: ${getTextProperty(props.title)}
summary: ${getTextProperty(props.summary)}
date: ${getDateProperty(props.date)}
tags: [${getMultiSelectProperty(props.tags)}]
---\n`
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
