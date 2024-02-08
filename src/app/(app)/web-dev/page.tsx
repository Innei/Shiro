/* eslint-disable react/display-name */
'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import { nanoid } from '@milkdown/utils'

import { useSocketIsConnect, useSocketSessionId } from '~/atoms'
import { StyledButton } from '~/components/ui/button'
import { apiClient } from '~/lib/request'
import { socketClient } from '~/socket'
import { EventTypes, SocketEmitEnum } from '~/types/events'

export default () => {
  const roomName = useMemo(() => `article-${nanoid()}`, [])
  const identity = useSocketSessionId()
  const update = () => {
    apiClient.activity.proxy.presence.update.post({
      data: {
        identity,
        position: (Math.random() * 100) | 0,
        ts: Date.now(),
        roomName,
      },
    })
  }

  const socketIsConnected = useSocketIsConnect()
  useEffect(() => {
    socketClient.emit(SocketEmitEnum.Join, {
      roomName,
    })

    const handler = (e: any) => {
      console.log(e, 'EventTypes.ACTIVITY_UPDATE_PRESENCE')
    }
    window.addEventListener(
      `event:${EventTypes.ACTIVITY_UPDATE_PRESENCE}`,
      handler,
    )

    return () => {
      socketClient.emit(SocketEmitEnum.Leave, {
        roomName,
      })
      window.removeEventListener(
        `event:${EventTypes.ACTIVITY_UPDATE_PRESENCE}`,
        handler,
      )
    }
  }, [roomName, identity, socketIsConnected])

  const { refetch } = useQuery({
    queryKey: ['for-test'],
    queryFn: () => {
      return apiClient.activity.proxy.presence.get({
        params: { room_name: roomName },
      })
    },
    enabled: false,
  })
  return (
    <div className="flex gap-4 p-5">
      <StyledButton onClick={update}>update</StyledButton>
      <StyledButton onClick={() => refetch()}>get</StyledButton>
      <ReadPresenceTimeline />
    </div>
  )
}

const ReadPresenceTimeline = () => {
  return <div className="fixed bottom-0 left-0 top-0">1</div>
}
