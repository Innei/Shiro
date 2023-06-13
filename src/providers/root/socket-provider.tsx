'use client'

import { createContext, useEffect } from 'react'

import { socketClient } from '~/socket'

const Context = createContext<typeof socketClient>(null as any)
export const SocketProvider: Component = ({ children }) => {
  useEffect(() => {
    socketClient.initIO()
  }, [])

  return <Context.Provider value={socketClient}>{children}</Context.Provider>
}
