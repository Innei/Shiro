'use client'

import { Fragment, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import type { FC } from 'react'

import { parseDate, relativeTimeFromNow } from '~/lib/datetime'

const formatTime = (date: string | Date, relativeBeforeDay?: number) => {
  if (
    relativeBeforeDay &&
    Math.abs(dayjs(date).diff(new Date(), 'd')) > relativeBeforeDay
  ) {
    return parseDate(date, 'YYYY 年 M 月 D 日 dddd')
  }
  return relativeTimeFromNow(date)
}
export const RelativeTime: FC<{
  date: string | Date
  displayAbsoluteTimeAfterDay?: number
}> = (props) => {
  const { displayAbsoluteTimeAfterDay = 29 } = props
  const [relative, setRelative] = useState<string>(
    formatTime(props.date, displayAbsoluteTimeAfterDay),
  )

  useEffect(() => {
    setRelative(formatTime(props.date, displayAbsoluteTimeAfterDay))
    let timer: any = setInterval(() => {
      setRelative(formatTime(props.date, displayAbsoluteTimeAfterDay))
    }, 1000)

    return () => {
      timer = clearInterval(timer)
    }
  }, [props.date, displayAbsoluteTimeAfterDay])

  return <Fragment>{relative}</Fragment>
}
