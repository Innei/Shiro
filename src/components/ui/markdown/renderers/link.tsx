import { memo, useCallback } from 'react'
import Router from 'next/router'
import type { FC, ReactNode } from 'react'

import {
  isGithubProfileUrl,
  isTelegramUrl,
  isTwitterProfileUrl,
} from '~/lib/link-parser'

import { FloatPopover } from '../../float-popover'
import { Favicon } from '../../rich-link/Favicon'
import { RichLink } from '../../rich-link/RichLink'

export const MLink: FC<{
  href: string
  title?: string
  children?: ReactNode
}> = memo(({ href, children, title }) => {
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
            Router.push(toUrlParser.pathname)
            break
          }
          default: {
            window.open(toUrlParser.pathname)
          }
        }
      }
    },
    [href],
  )

  let parsedType = ''
  let parsedName = ''
  try {
    const url = new URL(href)
    switch (true) {
      case isGithubProfileUrl(url): {
        parsedType = 'GH'
        parsedName = url.pathname.split('/')[1]
        break
      }
      case isTwitterProfileUrl(url): {
        parsedType = 'TW'
        parsedName = url.pathname.split('/')[1]
        break
      }
      case isTelegramUrl(url): {
        parsedType = 'TG'
        parsedName = url.pathname.split('/')[1]
        break
      }
    }
  } catch {}

  const showRichLink = !!parsedType && !!parsedName

  return (
    <FloatPopover
      as="span"
      wrapperClassName="!inline"
      type="tooltip"
      TriggerComponent={useCallback(
        () => (
          <span className="inline-flex items-center">
            {!showRichLink && <Favicon href={href} />}
            {showRichLink ? (
              <RichLink name={parsedName} source={parsedType} />
            ) : (
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
            )}

            <i className="icon-[mingcute--external-link-line]" />
          </span>
        ),
        [
          handleRedirect,
          children,
          href,
          title,
          showRichLink,
          parsedName,
          parsedType,
        ],
      )}
    >
      <span>{href}</span>
    </FloatPopover>
  )
})
MLink.displayName = 'MLink'
