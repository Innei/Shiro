'use client'

import { useQuery } from '@tanstack/react-query'
import { memo, useCallback, useDeferredValue, useEffect, useMemo } from 'react'
import type { FC } from 'react'

import {
  useActivityPresenceByRoomName,
  useActivityPresenceBySessionId,
  useIsMobile,
  useSocketSessionId,
} from '~/atoms/hooks'
import { FloatPopover } from '~/components/ui/float-popover'
import { EmitKeyMap } from '~/constants/keys'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useIsDark } from '~/hooks/common/use-is-dark'
import { useReadPercent } from '~/hooks/shared/use-read-percent'
import { getColorScheme, stringToHue } from '~/lib/color'
import { debounce } from '~/lib/lodash'
import { apiClient } from '~/lib/request'
import { queries } from '~/queries/definition'
import { socketClient } from '~/socket'

import { useRoomContext } from './Room'

export const Presence = () => {
  const isMobile = useIsMobile()

  const isClient = useIsClient()

  return isMobile ? null : isClient ? <PresenceImpl /> : null
}

const PresenceImpl = () => {
  const { roomName } = useRoomContext()

  const { refetch } = useQuery({
    ...queries.activity.presence(roomName),

    refetchOnMount: true,
    refetchInterval: 30_000,
  })

  const identity = useSocketSessionId()

  const update = useCallback(
    debounce((position: number) => {
      apiClient.activity.proxy.presence.update.post({
        data: {
          identity,
          position,
          ts: Date.now(),
          roomName,
          sid: socketClient.socket.id,
        },
      })
    }, 1000),
    [identity],
  )

  const percent = useReadPercent()

  const updateWithPercent = useEventCallback(() => update(percent))

  useEffect(() => {
    const handler = () => {
      refetch()
      updateWithPercent()
    }
    window.addEventListener(EmitKeyMap.SocketConnected, handler)

    return () => {
      window.removeEventListener(EmitKeyMap.SocketConnected, handler)
    }
  }, [refetch, updateWithPercent])

  useEffect(() => {
    update(percent)
  }, [percent, update])

  return <ReadPresenceTimeline />
}

const ReadPresenceTimeline = () => {
  const sessionId = useSocketSessionId()
  const activityPresence = useActivityPresenceBySessionId(sessionId)
  const { roomName } = useRoomContext()
  const activityPresenceIdsCurrentRoom = useActivityPresenceByRoomName(roomName)
  // console.log(

  //   activityPresence,
  //   'activityPresence',
  //   sessionId,
  //   useActivityPresence(),
  // )
  const position = activityPresence?.position
  if (typeof position !== 'number') return null

  return (
    <div className="fixed bottom-0 left-0 top-[4.5rem]">
      {activityPresenceIdsCurrentRoom.map((identity) => {
        return (
          <TimelineItem
            key={identity}
            identity={identity}
            type={identity === sessionId ? 'current' : 'other'}
          />
        )
      })}
    </div>
  )
}

interface TimelineItemProps {
  identity: string
  type: 'current' | 'other'
}
const TimelineItem: FC<TimelineItemProps> = memo(({ type, identity }) => {
  const presence = useActivityPresenceBySessionId(identity)

  const readPercent = useReadPercent()
  const isCurrent = type === 'current'

  const position = useDeferredValue(
    isCurrent ? readPercent : presence?.position,
  )
  const isDark = useIsDark()
  const bgColor = useMemo(() => {
    if (type === 'current') return ''
    if (!presence) return ''
    return getColorScheme(stringToHue(presence.identity))[
      isDark ? 'dark' : 'light'
    ].background
  }, [isDark, presence, type])
  if (!presence && isCurrent) return null

  if (typeof position !== 'number') return null

  return (
    <FloatPopover
      asChild
      placement="right"
      offset={30}
      type="tooltip"
      triggerElement={
        <div
          className="absolute h-2 -translate-x-12 rounded-full bg-accent duration-200 hover:-translate-x-8 hover:opacity-50"
          style={{
            top: `${position}%`,
            backgroundColor: bgColor,
            opacity: isCurrent ? 0.3 : 0.15,
            width: isCurrent ? '90px' : '80px',
          }}
        />
      }
    >
      {isCurrent ? (
        <p>你在这里。</p>
      ) : (
        <p>读者 {presence?.identity.slice(0, 2).toUpperCase()} 在这里。</p>
      )}
      <p>阅读进度 {position}%</p>
    </FloatPopover>
  )
})

TimelineItem.displayName = 'TimelineItem'
