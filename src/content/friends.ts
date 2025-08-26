interface Friend {
  name: string
  url: string
  avatar?: string
  motto?: string
  tags?: string[]
}

const friends: Friend[] = [
  {
    name: '林深时觉寒',
    url: 'https://ikangjia.cn',
    motto: 'Every dog has its day.',
  },
  {
    name: '风の守望者',
    url: 'https://wind-watcher.cn/',
    motto: '去成为一个闪闪发光的大人吧',
  },
  {
    name: '贼歪',
    url: 'https://varzy.me',
    motto: '尽管平平无奇，但仍然希望这个世界的运行轨迹能因我而发生一丝偏转。',
  },
]

export default friends
