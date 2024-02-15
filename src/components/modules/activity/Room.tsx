'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import type { FC, PropsWithChildren } from 'react'

import { useSocketIsConnect } from '~/atoms/hooks'
import { socketClient } from '~/socket'
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

  const ctxValue = useMemo(() => ({ roomName }), [roomName])
  useEffect(() => {
    if (!socketIsConnect) return
    socketClient.emit(SocketEmitEnum.Join, {
      roomName,
    })

    return () => {
      socketClient.emit(SocketEmitEnum.Leave, {
        roomName,
      })
    }
  }, [roomName, socketIsConnect])

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
