'use client'

import type { ReactNode } from 'react'

import { useIsClient } from '~/hooks/common/use-is-client'

export const ClientOnly: Component<{
  fallback?: ReactNode
}> = (props) => {
  const isClient = useIsClient()
  if (!isClient) return props.fallback ?? null
  return <>{props.children}</>
}

export const withClientOnly =
  <P extends {}>(Component: Component<P>) =>
  (props: P) => (
    <ClientOnly>
      <Component {...props} />
    </ClientOnly>
  )
