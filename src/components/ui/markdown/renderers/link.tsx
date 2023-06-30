import { memo, useCallback } from 'react'
import Router from 'next/router'
import type { FC, ReactNode } from 'react'

import { FloatPopover } from '../../float-popover'

export const MLink: FC<{
  href: string
  title?: string
  children?: ReactNode
}> = memo((props) => {
  const handleRedirect = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const href = props.href
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
            Router.push(toUrlParser.pathname)
            break
          }
          default: {
            window.open(toUrlParser.pathname)
          }
        }
      }
    },
    [props.href],
  )

  return (
    <FloatPopover
      as="span"
      wrapperClassName="!inline"
      type="tooltip"
      TriggerComponent={useCallback(
        () => (
          <span className="inline-flex items-center">
            <a
              className="shiro-link--underline"
              href={props.href}
              target="_blank"
              onClick={handleRedirect}
              title={props.title}
              rel="noreferrer"
            >
              {props.children}
            </a>

            <i className="icon-[mingcute--external-link-line]" />
          </span>
        ),
        [handleRedirect, props.children, props.href, props.title],
      )}
    >
      <span>{props.href}</span>
    </FloatPopover>
  )
})
MLink.displayName = 'MLink'
