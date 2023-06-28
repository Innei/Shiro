import type { FC, PropsWithChildren } from 'react'

import { useIsClientTransition } from '~/hooks/common/use-is-client'

export const withNoSSR = <P,>(
  Component: FC<PropsWithChildren<P>>,
): FC<PropsWithChildren<P>> => {
  return (props: PropsWithChildren<P>) => {
    const isClient = useIsClientTransition()
    if (!isClient) return null
    // @ts-ignore
    return <Component {...props} />
  }
}
