'use client'

import { useRouter } from 'next/navigation'
import type { FC, ReactNode } from 'react'
import { memo, useCallback, useMemo } from 'react'

import { isServerSide } from '~/lib/env'
import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

import { FloatPopover } from '../float-popover'
import { Favicon } from '../rich-link/Favicon'

export const MLink: FC<{
  href: string
  title?: string
  children?: ReactNode
  text?: string
  popper?: boolean
}> = memo(({ href, children, title, popper = true }) => {
  const router = useRouter()
  const isSelfUrl = useMemo(() => {
    if (isServerSide) return false
    const locateUrl = new URL(location.href)

    let toUrlParser
    try {
      toUrlParser = new URL(href)
    } catch {
      try {
        toUrlParser = new URL(href, location.origin)
      } catch {
        return false
      }
    }
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
      const pathArr = toUrlParser.pathname.split('/').find(Boolean)
      const headPath = pathArr

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

  const el = (
    <span className="inline items-center font-sans">
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

      <i className="i-mingcute-arrow-right-up-line translate-y-[2px] opacity-70" />
    </span>
  )
  if (!popper) return el
  return (
    <FloatPopover
      as="span"
      wrapperClassName="!inline"
      type="tooltip"
      offset={0}
      triggerElement={el}
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
    <span className="center mr-1 inline-flex size-4">
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
