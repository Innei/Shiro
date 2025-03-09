'use client'

import type { FC, PropsWithChildren } from 'react'
import { createContext, use, useEffect, useMemo } from 'react'

import { useRemoveActivityPresenceBySessionId } from '~/atoms/hooks/activity'
import { useSocketIsConnect, useSocketSessionId } from '~/atoms/hooks/socket'
import { socketWorker } from '~/socket/worker-client'
import { SocketEmitEnum } from '~/types/events'

interface RoomContextValue {
  roomName: string
}
const RoomContext = createContext<RoomContextValue | null>(null)

export const RoomProvider: FC<
  {
    roomName: string
  } & PropsWithChildren
> = ({ roomName, children }) => {
  const socketIsConnect = useSocketIsConnect()
  const identity = useSocketSessionId()
  const ctxValue = useMemo(() => ({ roomName }), [roomName])
  const removeSession = useRemoveActivityPresenceBySessionId()
  useEffect(() => {
    if (!socketIsConnect) return
    socketWorker.emit(SocketEmitEnum.Join, {
      roomName,
    })

    return () => {
      socketWorker.emit(SocketEmitEnum.Leave, {
        roomName,
      })
      removeSession(identity)
    }
  }, [roomName, socketIsConnect, identity, removeSession])

  return <RoomContext value={ctxValue}>{children}</RoomContext>
}

export const useRoomContext = () => {
  const ctx = use(RoomContext)

  if (!ctx) {
    throw new Error('useRoomContext must be used within RoomProvider')
  }
  return ctx
}

export const useMaybeInRoomContext = () => use(RoomContext)
