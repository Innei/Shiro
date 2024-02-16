/* eslint-disable react/display-name */
'use client'

import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { m } from 'framer-motion'

import {
  useActivityPresence,
  useActivityPresenceBySessionId,
  useSocketIsConnect,
  useSocketSessionId,
} from '~/atoms/hooks'
import { StyledButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { debounce } from '~/lib/lodash'
import { apiClient } from '~/lib/request'
import { usePageScrollLocation } from '~/providers/root/page-scroll-info-provider'
import { queries } from '~/queries/definition'
import { socketClient } from '~/socket'
import { SocketEmitEnum } from '~/types/events'

export default () => {
  const roomName = useMemo(() => `article-${111112222}`, [])
  const identity = useSocketSessionId()
  const update = useCallback(
    debounce((position) => {
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

  const socketIsConnected = useSocketIsConnect()
  useEffect(() => {
    socketClient.emit(SocketEmitEnum.Join, {
      roomName,
    })

    return () => {
      socketClient.emit(SocketEmitEnum.Leave, {
        roomName,
      })
    }
  }, [roomName, identity, socketIsConnected])

  const { refetch } = useQuery({
    ...queries.activity.presence(roomName),
    enabled: false,
  })

  const scrollLocation = usePageScrollLocation()

  useEffect(() => {
    update((scrollLocation / document.body.scrollHeight) * 100)
  }, [scrollLocation, update])

  return (
    <>
      <div className="flex gap-4 p-5">
        <StyledButton onClick={update}>update</StyledButton>
        <StyledButton onClick={() => refetch()}>get</StyledButton>
        <ReadPresenceTimeline />
      </div>
      <div className="h-[2222px]" />
    </>
  )
}

const ReadPresenceTimeline = () => {
  const sessionId = useSocketSessionId()
  const activityPresence = useActivityPresenceBySessionId(sessionId)
  console.log(
    activityPresence,
    'activityPresence',
    sessionId,
    useActivityPresence(),
  )

  return (
    <div className="fixed bottom-0 left-0 top-0">
      <FloatPopover
        asChild
        placement="right"
        offset={30}
        type="tooltip"
        triggerElement={
          <m.div
            layout
            className="absolute h-2 w-[100px] -translate-x-12 rounded-full bg-accent opacity-50 duration-200 hover:-translate-x-8"
            style={{
              top: `${activityPresence?.position}%`,
            }}
          />
        }
      >
        <p>你在这里。</p>
        <p>阅读进度 50%</p>
      </FloatPopover>
    </div>
  )
}
