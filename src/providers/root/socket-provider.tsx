'use client'

import { useEffect } from 'react'

export const SocketContainer: Component = () => {
  useEffect(() => {
    import('~/socket').then((module) => {
      const { socketClient } = module
      socketClient.initIO()
    })
  }, [])

  return null
}
