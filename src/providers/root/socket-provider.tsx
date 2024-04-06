'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { deleteActivityPresence } from '~/atoms/activity'
import { useSocketIsConnect, useSocketSessionId } from '~/atoms/hooks'
import { usePageIsActive } from '~/hooks/common/use-is-active'
import { useIsClient } from '~/hooks/common/use-is-client'
import { SocketEmitEnum } from '~/types/events'

import { socketWorker } from '../../socket/worker-client'

if (typeof window !== 'undefined') {
  import('../../socket/worker-client')
}
export const SocketContainer = () => {
  return useIsClient() ? <SocketContainerImpl /> : null
}
const SocketContainerImpl: Component = () => {
  const connectOnce = useRef(false)
  const router = useRouter()
  useEffect(() => {
    if (connectOnce.current) return
    import('../../socket/worker-client').then(({ socketWorker }) => {
      socketWorker.setRouter(router)

      connectOnce.current = true
    })
  }, [])

  const webSocketSessionId = useSocketSessionId()
  const previousWebSocketSessionIdRef = useRef(webSocketSessionId)

  const socketIsConnected = useSocketIsConnect()

  useEffect(() => {
    const previousWebSocketSessionId = previousWebSocketSessionIdRef.current
    previousWebSocketSessionIdRef.current = webSocketSessionId
    if (!socketIsConnected) return

    socketWorker.emit(SocketEmitEnum.UpdateSid, {
      sessionId: webSocketSessionId,
    })

    ///

    deleteActivityPresence(previousWebSocketSessionId)
  }, [socketIsConnected, webSocketSessionId])

  const pageIsActive = usePageIsActive()
  useEffect(() => {
    if (pageIsActive && !socketIsConnected) {
      socketWorker.reconnect()
    }
  }, [pageIsActive, socketIsConnected])

  return null
}
