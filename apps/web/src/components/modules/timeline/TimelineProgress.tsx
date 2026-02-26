'use client'

import { useEffect, useState } from 'react'

import { CountUp } from '~/components/ui/number-transition'
import {
  dayOfYear,
  daysOfYear,
  secondOfDay,
  secondOfDays,
} from '~/lib/datetime'

const PROGRESS_DURATION = 2
export const TimelineProgress = () => {
  const [percentOfYear, setPercentYear] = useState(0)
  const [percentOfDay, setPercentDay] = useState(0)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentDay, setCurrentDay] = useState(dayOfYear())

  useEffect(() => {
    const timer = setInterval(() => {
      const year = new Date().getFullYear()
      const day = dayOfYear()
      setCurrentDay(day)
      setCurrentYear(year)
    }, PROGRESS_DURATION)
    return () => clearInterval(timer)
  }, [])

  function updatePercent() {
    const nowY = (dayOfYear() / daysOfYear(new Date().getFullYear())) * 100
    const nowD = (secondOfDay() / secondOfDays) * 100
    if (nowY !== percentOfYear) {
      setPercentYear(nowY)
    }
    setPercentDay(nowD)
  }
  useEffect(() => {
    updatePercent()
    let timer = setInterval(updatePercent, PROGRESS_DURATION)
    return () => {
      // @ts-ignore
      timer = clearInterval(timer)
    }
  }, [])
  return (
    <>
      <p>
        <span className="shrink-0">今天是 {currentYear} 年的第</span>
        <CountUp
          to={currentDay}
          className="mx-1"
          decimals={0}
          duration={PROGRESS_DURATION}
        />
        <span className="shrink-0">天</span>
      </p>
      <p>
        今年已过{' '}
        <CountUp to={percentOfYear} decimals={6} duration={PROGRESS_DURATION} />
        %
      </p>
      <p>
        今天已过{' '}
        <CountUp to={percentOfDay} decimals={6} duration={PROGRESS_DURATION} />%
      </p>
    </>
  )
}
