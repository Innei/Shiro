'use client'

import { useEffect, useRef, useState } from 'react'

import type { ClientRouter } from './router'

export default function Page() {
  const [isReady, setIsReady] = useState(false)
  const RouterRef = useRef<typeof ClientRouter>(undefined)

  useEffect(() => {
    import('./router').then(({ ClientRouter }) => {
      RouterRef.current = ClientRouter
      setIsReady(true)
    })
  }, [])
  if (isReady && RouterRef.current) {
    return <RouterRef.current />
  }

  return (
    <div className="center fixed left-0 top-0 flex size-full">
      <i className="loading loading-dots" />
    </div>
  )
}
