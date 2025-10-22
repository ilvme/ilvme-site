export async function calcAllWords() {
  // 动态导入 Astro 的内容 API
  const { getCollection } = await import('astro:content')

  // 获取所有文章
  const posts = await getCollection('posts')

  let totalWords = 0

  // 遍历所有文章
  for (const post of posts) {
    // 获取文章内容
    const content = post.body

    // 使用正则表达式去除空格、换行等无效字符，只保留有效字符
    const validChars = content.replace(/[\s\n\r\t\0\x0b\ufeff]/g, '')

    // 累加有效字符数
    totalWords += validChars.length
  }

  return totalWords
}
