import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

export const useRelativeTime = () => {
  const t = useTranslations('datetime')

  const relativeTimeFromNow = useCallback(
    (time: Date | string, current = new Date()) => {
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
        return gap <= 0
          ? t('relative_justNow')
          : t('relative_secondsAgo', { count: gap })
      } else if (elapsed < msPerHour) {
        return t('relative_minutesAgo', {
          count: Math.round(elapsed / msPerMinute),
        })
      } else if (elapsed < msPerDay) {
        return t('relative_hoursAgo', {
          count: Math.round(elapsed / msPerHour),
        })
      } else if (elapsed < msPerMonth) {
        return t('relative_daysAgo', { count: Math.round(elapsed / msPerDay) })
      } else if (elapsed < msPerYear) {
        return t('relative_monthsAgo', {
          count: Math.round(elapsed / msPerMonth),
        })
      } else {
        return t('relative_yearsAgo', {
          count: Math.round(elapsed / msPerYear),
        })
      }
    },
    [t],
  )

  return { relativeTimeFromNow }
}
