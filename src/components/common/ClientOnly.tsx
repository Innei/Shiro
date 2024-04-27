/* eslint-disable react/display-name */
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

export const withClientOnly = <P extends {}>(Component: Component<P>) => {
  return (props: P) => {
    return (
      <ClientOnly>
        <Component {...props} />
      </ClientOnly>
    )
  }
}
