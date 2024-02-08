'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { useSocketIsConnect, useSocketSessionId } from '~/atoms'
import { socketClient } from '~/socket'
import { SocketEmitEnum } from '~/types/events'

export const SocketContainer: Component = () => {
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

  const socketIsConnected = useSocketIsConnect()

  useEffect(() => {
    if (!socketIsConnected) return

    socketClient.emit(SocketEmitEnum.UpdateSid, {
      sessionId: webSocketSessionId,
    })
  }, [socketIsConnected, webSocketSessionId])

  return null
}
