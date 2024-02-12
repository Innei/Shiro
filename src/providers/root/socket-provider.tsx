'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { deleteActivityPresence } from '~/atoms/activity'
import { useSocketIsConnect, useSocketSessionId } from '~/atoms/hooks'
import { usePageIsActive } from '~/hooks/common/use-is-active'
import { useIsClient } from '~/hooks/common/use-is-client'
import { socketClient } from '~/socket'
import { SocketEmitEnum } from '~/types/events'

export const SocketContainer = () => {
  return useIsClient() ? <SocketContainerImpl /> : null
}
const SocketContainerImpl: Component = () => {
  const connectOnce = useRef(false)
  const router = useRouter()
  useEffect(() => {
    if (connectOnce.current) return
    import('~/socket').then((module) => {
      const { socketClient } = module
      connectOnce.current = true
      socketClient.setRouter(router)
      socketClient.initIO()
    })
  }, [])

  const webSocketSessionId = useSocketSessionId()
  const previousWebSocketSessionIdRef = useRef(webSocketSessionId)

  const socketIsConnected = useSocketIsConnect()

  useEffect(() => {
    const previousWebSocketSessionId = previousWebSocketSessionIdRef.current
    previousWebSocketSessionIdRef.current = webSocketSessionId
    if (!socketIsConnected) return

    socketClient.emit(SocketEmitEnum.UpdateSid, {
      sessionId: webSocketSessionId,
    })

    ///

    deleteActivityPresence(previousWebSocketSessionId)
  }, [socketIsConnected, webSocketSessionId])

  const pageIsActive = usePageIsActive()
  useEffect(() => {
    if (pageIsActive && !socketIsConnected) {
      socketClient.reconnect()
    }
  }, [pageIsActive, socketIsConnected])

  return null
}
