'use client'

import { useLocale } from 'next-intl'
import { useEffect, useRef } from 'react'

import { useSocketIsConnect, useSocketSessionId } from '~/atoms/hooks/socket'
import { usePageIsActive } from '~/hooks/common/use-is-active'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useRouter } from '~/i18n/navigation'
import { SocketEmitEnum } from '~/types/events'

import { socketWorker } from '../../socket/worker-client'

if (typeof window !== 'undefined') {
  import('../../socket/worker-client')
}
export const SocketContainer = () =>
  useIsClient() ? <SocketContainerImpl /> : null
const SocketContainerImpl: Component = () => {
  const connectOnce = useRef(false)
  const router = useRouter()
  useEffect(() => {
    if (connectOnce.current) return

    socketWorker.setRouter(router)
    connectOnce.current = true
  }, [router])

  const webSocketSessionId = useSocketSessionId()
  const socketIsConnected = useSocketIsConnect()

  useEffect(() => {
    if (!socketIsConnected) return

    socketWorker.emit(SocketEmitEnum.UpdateSid, {
      sessionId: webSocketSessionId,
    })
  }, [socketIsConnected, webSocketSessionId])

  const locale = useLocale()
  useEffect(() => {
    if (!socketIsConnected) return
    socketWorker.emit(SocketEmitEnum.UpdateLang, { lang: locale })
  }, [socketIsConnected, locale])

  const pageIsActive = usePageIsActive()
  useEffect(() => {
    if (pageIsActive && !socketIsConnected) {
      socketWorker.reconnect()
    }
  }, [pageIsActive, socketIsConnected])

  return null
}
