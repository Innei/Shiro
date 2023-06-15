'use client'

import { useEffect } from 'react'

// const Context = createContext<TSocketClient>(null as any)
export const SocketProvider: Component = ({ children }) => {
  useEffect(() => {
    import('~/socket').then((module) => {
      const { socketClient } = module
      socketClient.initIO()
    })
  }, [])

  return <>{children}</>
}
