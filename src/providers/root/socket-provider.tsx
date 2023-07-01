'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

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

  return null
}
