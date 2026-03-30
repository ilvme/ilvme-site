const SiteConfig = {
  title: '和光同尘',
  description: '林深时觉寒的个人网站',
  author: '林深时觉寒',
  lang: `zh-CN`,
  siteUrl: 'https://ikangjia.cn',
  social: {
    // twitter: 'ilvme',
  },
  // icon: 'src/images/icon.png',
  // keywords: ['ilvme', 'ilvme.com', 'ilvme.site'],

  themeConfig: {
    pageSize: 7,
    comment: true, // 评论功能，特定文章想关闭评论功能，请在对应文章的 front matter 中添加 `comment: false`
    toc: true, // 是否显示文章目录，默认为 true。特定文章想关闭目录功能，请在对应文章的 front matter 中添加 `toc: false`
  },

  // 说说抓取间隔，单位：秒，低于5分钟，设置无效！！
  // 不要设置过短，否则会触发 notion 的 API 频率限制
  words_fetch_interval: 60 * 60,
  words_fetch_count: 30, // 获取的说说数量，默认 30，如设置为 -1，则获取所有
}

export default SiteConfig
