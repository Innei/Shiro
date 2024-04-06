'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import type { FC, PropsWithChildren } from 'react'

import { useSocketIsConnect, useSocketSessionId } from '~/atoms/hooks'
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
  useEffect(() => {
    if (!socketIsConnect) return
    socketWorker.emit(SocketEmitEnum.Join, {
      roomName,
    })

    return () => {
      socketWorker.emit(SocketEmitEnum.Leave, {
        roomName,
      })
    }
  }, [roomName, socketIsConnect, identity])

  return (
    <RoomContext.Provider value={ctxValue}>{children}</RoomContext.Provider>
  )
}

export const useRoomContext = () => {
  const ctx = useContext(RoomContext)

  if (!ctx) {
    throw new Error('useRoomContext must be used within RoomProvider')
  }
  return ctx
}

export const useMaybeInRoomContext = () => {
  return useContext(RoomContext)
}
