// 使用dayjs进行时间格式化
// 参数time可以是时间戳、Date对象或时间字符串
// format参数遵循dayjs的格式化规则，默认格式为'YYYY-MM-DD HH:mm:ss'
import dayjs from "dayjs";

export const formatTime = (
  time: string | number | Date | dayjs.Dayjs | null | undefined,
  format = "YYYY-MM-DD HH:mm:ss",
) => {
  return dayjs(time).format(format);
};

export const formatDate = (
  time: string | number | Date | dayjs.Dayjs | null | undefined,
  format = "YYYY-MM-DD",
) => {
  return dayjs(time).format(format);
};

// 传入时间，返回中文形式的相对于现在的时间，如几秒前、几分钟前、几小时前、几天前
export function formatPast(param: Date | number | string): string {
  const now = new Date();
  const date = param instanceof Date ? param : new Date(param);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "刚刚";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  } else {
    return `${diffInDays}天前`;
  }
}
