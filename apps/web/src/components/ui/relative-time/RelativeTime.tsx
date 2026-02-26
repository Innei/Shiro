'use client'

import { useFormatter } from 'next-intl'
import type { FC } from 'react'
import { Fragment, useCallback, useEffect, useState } from 'react'

import { useRelativeTime } from '~/hooks/common/use-relative-time'

export const RelativeTime: FC<{
  date: string | Date
  displayAbsoluteTimeAfterDay?: number
}> = (props) => {
  const { displayAbsoluteTimeAfterDay = 29 } = props
  const { relativeTimeFromNow } = useRelativeTime()
  const format = useFormatter()

  const formatTime = useCallback(
    (date: string | Date, relativeBeforeDay?: number) => {
      const dateObj = new Date(date)
      const daysDiff = Math.abs(
        Math.floor((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      )
      if (relativeBeforeDay && daysDiff > relativeBeforeDay) {
        return format.dateTime(dateObj, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })
      }
      return relativeTimeFromNow(date)
    },
    [format, relativeTimeFromNow],
  )

  const [relative, setRelative] = useState<string>('')

  useEffect(() => {
    setRelative(formatTime(props.date, displayAbsoluteTimeAfterDay))
    let timer: any = setInterval(() => {
      setRelative(formatTime(props.date, displayAbsoluteTimeAfterDay))
    }, 1000)

    return () => {
      timer = clearInterval(timer)
    }
  }, [props.date, displayAbsoluteTimeAfterDay, formatTime])

  return <Fragment>{relative}</Fragment>
}
