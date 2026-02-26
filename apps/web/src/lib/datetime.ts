export const dayOfYear = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const day = Math.floor(diff / oneDay)
  return day
}

export function daysOfYear(year?: number) {
  return isLeapYear(year ?? new Date().getFullYear()) ? 366 : 365
}

export function isLeapYear(year: number) {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
}

export const secondOfDay = () => {
  const dt = new Date()
  const secs = dt.getSeconds() + 60 * (dt.getMinutes() + 60 * dt.getHours())
  return secs
}

export const secondOfDays = 86400

export function isValidDate(d: any) {
  return d instanceof Date && !Number.isNaN(+d)
}
