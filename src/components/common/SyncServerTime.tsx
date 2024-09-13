'use client'

import { useQuery } from '@tanstack/react-query'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { memo, useEffect } from 'react'

import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useAccurateInterval } from '~/hooks/common/use-interval'
import { apiClient } from '~/lib/request'
import { jotaiStore } from '~/lib/store'

async function fetchTime() {
  const t1 = Date.now()
  const { t2, t3 } = await apiClient
    .proxy('server-time')
    .get<{
      t2: number
      t3: number
    }>()
    .then((time) => {
      const { t3: response_time, t2: request_time } = time

      return {
        t2: response_time,
        t3: request_time,
      }
    })
  const t4 = Date.now()

  const delay = (t4 - t1 - (t3 - t2)) / 2
  const serverTime = t3 + delay
  const gap = serverTime - t4

  return { serverTime, gap }
}

const serverTimeAtom = atom(new Date())

export const useSetServerTime = () => useSetAtom(serverTimeAtom)

export const getServerTime = () => {
  return jotaiStore.get(serverTimeAtom)
}

export const useServerTime = () => useAtomValue(serverTimeAtom)

export const SyncServerTime = memo(() => {
  const { data } = useQuery({
    queryKey: ['serverTime'],
    queryFn: fetchTime,
    refetchInterval: 1000 * 5 * 60,
    refetchOnMount: 'always',
    retry: false,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: 'always',

    meta: {
      persist: false,
    },
  })

  const setServerTime = useSetServerTime()

  const updater = useEventCallback(() => {
    if (!data) return
    const updateTime = () => {
      const estimatedServerTime = new Date(Date.now() + data.gap)

      setServerTime(estimatedServerTime)
    }

    updateTime()
  })
  useAccurateInterval(updater, {
    delay: 500,
    enable: !!data,
  })
  useEffect(() => {
    if (!data) {
      // fallback first
      setServerTime(new Date())
    }
  }, [data])

  return null
})

SyncServerTime.displayName = 'SyncServerTime'
