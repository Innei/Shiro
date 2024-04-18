'use client'

import { memo, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { FC, ReactNode } from 'react'

import { isServerSide } from '~/lib/env'
import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

import { FloatPopover } from '../float-popover'
import { Favicon } from '../rich-link/Favicon'

export const MLink: FC<{
  href: string
  title?: string
  children?: ReactNode
}> = memo(({ href, children, title }) => {
  const router = useRouter()
  const isSelfUrl = useMemo(() => {
    if (isServerSide) return false
    const locateUrl = new URL(location.href)

    const toUrlParser = new URL(href)
    return (
      toUrlParser.host === locateUrl.host ||
      (process.env.NODE_ENV === 'development' &&
        toUrlParser.host === 'innei.in')
    )
  }, [href])

  const handleRedirect = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const toUrlParser = new URL(href)
      if (!isSelfUrl) {
        return
      }
      e.preventDefault()
      const pathArr = toUrlParser.pathname.split('/').filter(Boolean)
      const headPath = pathArr[0]

      switch (headPath) {
        case 'posts':
        case 'notes':
        case 'category': {
          router.push(toUrlParser.pathname)
          break
        }
        default: {
          window.open(toUrlParser.pathname)
        }
      }
    },
    [href, isSelfUrl, router],
  )

  return (
    <FloatPopover
      as="span"
      wrapperClassName="!inline"
      type="tooltip"
      triggerElement={
        <span className="inline-flex items-center font-sans">
          {isSelfUrl ? <BizSelfFavicon /> : <Favicon href={href} />}
          <a
            className="shiro-link--underline"
            href={href}
            target="_blank"
            onClick={handleRedirect}
            title={title}
            rel="noreferrer"
          >
            {children}
          </a>

          <i className="icon-[mingcute--arrow-right-up-line] translate-y-[2px] opacity-70" />
        </span>
      }
    >
      <a href={href} target="_blank" rel="noreferrer">
        <span>{href}</span>
      </a>
    </FloatPopover>
  )
})
MLink.displayName = 'MLink'

const BizSelfFavicon = () => {
  const { favicon, faviconDark } = useAppConfigSelector((a) => a.site) || {}
  if (!favicon && !faviconDark) return null
  return (
    <span className="mr-1 inline-flex size-4 center">
      <img
        className="inline size-4 dark:hidden"
        src={favicon ? favicon : faviconDark ? faviconDark : ''}
      />
      <img
        className="hidden size-4 dark:inline"
        src={faviconDark ? faviconDark : favicon ? favicon : ''}
      />
    </span>
  )
}
