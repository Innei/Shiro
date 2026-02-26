'use client'

import type { FC, ReactNode } from 'react'
import { memo, useCallback, useMemo } from 'react'

import { useRouter } from '~/i18n/navigation'
import { isServerSide } from '~/lib/env'
import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

import { FloatPopover } from '../float-popover'
import { Favicon } from '../rich-link/Favicon'

export const MarkdownLink: FC<{
  href: string
  title?: string
  children?: ReactNode
  text?: string
  popper?: boolean
  noIcon?: boolean
}> = memo(({ href, children, title, popper = true, noIcon = false }) => {
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
      {isSelfUrl && !noIcon ? (
        <BizSelfFavicon />
      ) : (
        <Favicon href={href} noIcon={noIcon} />
      )}
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
    </span>
  )
  if (!popper) return el
  return (
    <FloatPopover
      as="span"
      wrapperClassName="inline!"
      type="tooltip"
      offset={0}
      triggerElement={el}
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="shiro-link--underline"
      >
        <span>{href}</span>
      </a>
    </FloatPopover>
  )
})
MarkdownLink.displayName = 'MarkdownLink'

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
