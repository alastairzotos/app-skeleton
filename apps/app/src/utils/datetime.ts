import dayjs from "dayjs"

export const formatDateTime = (date: string) => {
  return dayjs(new Date(date)).format('DD MMMM YYYY, HH:mm')
}
