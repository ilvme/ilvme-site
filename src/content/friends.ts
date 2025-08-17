interface Friend {
  name: string
  url: string
  avatar?: string
  description?: string
  tags?: string[]
}

const friends: Friend[] = [
  {
    name: '林深时觉寒',
    url: 'https://ikangjia.cn',
    description: 'Every dog has its day.',
  },
  {
    name: '风の守望者',
    url: 'https://wind-watcher.cn/',
  },
  {
    name: '贼歪',
    url: 'https://varzy.me',
  },
]

export default friends
