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
    comment: !import.meta.env.DEV, // 评论功能，特定文章想关闭评论功能，请在对应文章的 front matter 中添加 `comment: false`
  },

  // 说说抓取间隔，单位：秒，低于5分钟，设置无效！！
  // 不要设置过短，否则会触发 notion 的 API 频率限制
  words_fetch_interval: 30 * 60,
}

export default SiteConfig
