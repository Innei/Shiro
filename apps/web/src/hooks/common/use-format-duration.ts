import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

export const useFormatDuration = () => {
  const t = useTranslations('datetime')

  const formatDuration = useCallback(
    (seconds: number) => {
      const days = Math.floor(seconds / (3600 * 24))
      seconds -= days * 3600 * 24
      const hrs = Math.floor(seconds / 3600)
      seconds -= hrs * 3600
      const mins = Math.floor(seconds / 60)
      seconds -= mins * 60

      const parts: string[] = []
      if (days > 0) parts.push(t('duration_days', { count: days }))
      if (hrs > 0) parts.push(t('duration_hours', { count: hrs }))
      if (mins > 0) parts.push(t('duration_minutes', { count: mins }))
      if (seconds > 0)
        parts.push(t('duration_seconds', { count: Math.ceil(seconds) }))

      return parts.join(' ')
    },
    [t],
  )

  return { formatDuration }
}
