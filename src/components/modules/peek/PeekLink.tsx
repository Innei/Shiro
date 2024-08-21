import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { FC, PropsWithChildren, SyntheticEvent } from 'react'
import { useCallback } from 'react'

import useIsCommandOrControlPressed from '~/hooks/common/use-is-command-or-control-pressed'
import { preventDefault } from '~/lib/dom'
import { Routes } from '~/lib/route-builder'

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

  const pathname = usePathname()
  const isCommandPressed = useIsCommandOrControlPressed()

  const handlePeek = useCallback(
    async (e: SyntheticEvent) => {
      if (pathname === '/' || pathname === Routes.Posts) {
        return
      }
      if (isCommandPressed) return
      const success = peek(href)
      if (success) preventDefault(e)
    },
    [href, isCommandPressed, pathname, peek],
  )

  return (
    <Link href={href} onClick={handlePeek} {...rest}>
      {children}
    </Link>
  )
}
