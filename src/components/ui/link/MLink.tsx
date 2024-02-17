import { memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { FC, ReactNode } from 'react'

import { FloatPopover } from '../float-popover'
import { Favicon } from '../rich-link/Favicon'

export const MLink: FC<{
  href: string
  title?: string
  children?: ReactNode
  text?: string
}> = memo(({ href, children, title, text }) => {
  const router = useRouter()
  const handleRedirect = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const locateUrl = new URL(location.href)

      const toUrlParser = new URL(href)

      if (
        toUrlParser.host === locateUrl.host ||
        (process.env.NODE_ENV === 'development' &&
          toUrlParser.host === 'innei.ren')
      ) {
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
      }
    },
    [href, router],
  )

  return (
    <FloatPopover
      as="span"
      wrapperClassName="!inline"
      type="tooltip"
      TriggerComponent={useCallback(
        () => (
          <span className="inline items-center">
            <Favicon href={href} />
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
        ),
        [handleRedirect, children, href, title],
      )}
    >
      <a href={href} target="_blank" rel="noreferrer">
        <span>{href}</span>
      </a>
    </FloatPopover>
  )
})
MLink.displayName = 'MLink'
