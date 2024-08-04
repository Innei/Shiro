import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'

import customParseFormat from 'dayjs/plugin/customParseFormat'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(customParseFormat)
dayjs.extend(LocalizedFormat)
dayjs.locale('zh-cn')

export enum DateFormat {
  'MMM DD YYYY',
  'HH:mm',
  'LLLL',
  'H:mm:ss A',
  'YYYY-MM-DD',
  'YYYY-MM-DD dddd',
  'YYYY-MM-DD ddd',
  'MM-DD ddd',

  'YYYY 年 M 月 D 日 dddd',
}

export const parseDate = (
  time: string | Date,
  format: keyof typeof DateFormat,
) => dayjs(time).format(format)

export const relativeTimeFromNow = (
  time: Date | string,
  current = new Date(),
) => {
  if (!time) {
    return ''
  }
  time = new Date(time)
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365

  const elapsed = +current - +time

  if (elapsed < msPerMinute) {
    const gap = Math.ceil(elapsed / 1000)
    return gap <= 0 ? 'just now' : `${gap} seconds ago`
  } else if (elapsed < msPerHour) {
    return `${Math.round(elapsed / msPerMinute)} minutes ago`
  } else if (elapsed < msPerDay) {
    return `${Math.round(elapsed / msPerHour)} hours ago`
  } else if (elapsed < msPerMonth) {
    return `${Math.round(elapsed / msPerDay)} days ago`
  } else if (elapsed < msPerYear) {
    return `${Math.round(elapsed / msPerMonth)} months ago`
  } else {
    return `${Math.round(elapsed / msPerYear)} years ago`
  }
}
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

export function formatSeconds(seconds: number) {
  const days = Math.floor(seconds / (3600 * 24))
  seconds -= days * 3600 * 24
  const hrs = Math.floor(seconds / 3600)
  seconds -= hrs * 3600
  const mins = Math.floor(seconds / 60)

  let formatted = ''
  if (days > 0) formatted += `${days} days `
  if (hrs > 0) formatted += `${hrs} hours `
  if (mins > 0) formatted += `${mins} minutes`

  return formatted.trim()
}
