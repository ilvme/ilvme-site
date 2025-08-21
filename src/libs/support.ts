// 使用dayjs进行时间格式化
// 参数time可以是时间戳、Date对象或时间字符串
// format参数遵循dayjs的格式化规则，默认格式为'YYYY-MM-DD HH:mm:ss'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export const formatTime = (
  time: string | number | Date | dayjs.Dayjs | null | undefined,
  format = 'YYYY-MM-DD HH:mm:ss'
) => {
  return dayjs(time).format(format)
}

export const formatDate = (time: string | number | Date | dayjs.Dayjs | null | undefined, format = 'YYYY-MM-DD') => {
  return dayjs(time).format(format)
}

// 传入时间，返回中文形式的相对于现在的时间，如几秒前、几分钟几秒前、几小时几分钟前、几天几小时前、几个月几天前、几年几个月几天前
export function formatPast(param: Date | number | string): string {
  const now = new Date()
  const date = param instanceof Date ? param : new Date(param)

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date input')
  }

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInMinutes < 60) {
    const seconds = diffInSeconds % 60
    if (seconds > 0) {
      return `${diffInMinutes}分钟${seconds}秒前`
    }
    return `${diffInMinutes}分钟前`
  } else if (diffInHours < 24) {
    const minutes = diffInMinutes % 60
    if (minutes > 0) {
      return `${diffInHours}小时${minutes}分钟前`
    }
    return `${diffInHours}小时前`
  } else if (diffInDays < 30) {
    const hours = diffInHours % 24
    if (hours > 0) {
      return `${diffInDays}天${hours}小时前`
    }
    return `${diffInDays}天前`
  } else if (diffInYears < 1) {
    const days = diffInDays % 30
    if (days > 0) {
      return `${diffInMonths}个月${days}天前`
    }
    return `${diffInMonths}个月前`
  } else {
    const months = diffInMonths % 12
    const days = diffInDays % 30
    let result = `${diffInYears}年`
    if (months > 0) {
      result += `${months}个月`
    }
    if (days > 0) {
      result += `${days}天`
    }
    result += '前'
    return result
  }
}
//   const now = new Date()
//   const date = param instanceof Date ? param : new Date(param)
//
//   if (isNaN(date.getTime())) {
//     throw new Error('Invalid date input')
//   }
//
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
//   const diffInMinutes = Math.floor(diffInSeconds / 60)
//   const diffInHours = Math.floor(diffInMinutes / 60)
//   const diffInDays = Math.floor(diffInHours / 24)
//
//   if (diffInSeconds < 60) {
//     return '刚刚'
//   } else if (diffInMinutes < 60) {
//     return `${diffInMinutes}分钟前`
//   } else if (diffInHours < 24) {
//     return `${diffInHours}小时前`
//   } else if (diffInDays < 30) {
//     return `${diffInDays}天前`
//   } else if (diffInDays < 365) {
//     return `${Math.floor(diffInDays / 30)}个月前`
//   } else {
//     return `${Math.floor(diffInDays / 365)}年前`
//   }
// }
