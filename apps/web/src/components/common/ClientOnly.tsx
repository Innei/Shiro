'use client'

import type { ReactNode } from 'react'

import { useIsClient } from '~/hooks/common/use-is-client'

export const ClientOnly: Component<{
  fallback?: ReactNode
}> = ({ children, fallback }) => {
  const isClient = useIsClient()
  if (!isClient) return fallback ?? null
  return <>{children}</>
}

export const withClientOnly =
  <P extends {}>(Component: Component<P>) =>
  (props: P) => (
    <ClientOnly>
      <Component {...props} />
    </ClientOnly>
  )
