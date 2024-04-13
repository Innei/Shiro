/* eslint-disable react/display-name */
'use client'

import { useIsClient } from '~/hooks/common/use-is-client'

export const ClientOnly: Component = (props) => {
  const isClient = useIsClient()
  if (!isClient) return null
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
