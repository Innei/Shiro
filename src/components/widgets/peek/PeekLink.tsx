import { useCallback } from 'react'
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { FC, PropsWithChildren, SyntheticEvent } from 'react'

import { preventDefault } from '~/lib/dom'

import { usePeek } from './usePeek'

export const PeekLink: FC<
  {
    href: string
  } & LinkProps &
    PropsWithChildren &
    React.AnchorHTMLAttributes<HTMLAnchorElement>
> = (props) => {
  const { href, children, ...rest } = props

  const peek = usePeek()

  const handlePeek = useCallback(
    async (e: SyntheticEvent) => {
      const success = peek(href)
      if (success) preventDefault(e)
    },
    [href, peek],
  )

  return (
    <Link href={href} onClick={handlePeek} {...rest}>
      {children}
    </Link>
  )
}
