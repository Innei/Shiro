import { memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { FC, ReactNode } from 'react'

import {
  isGithubProfileUrl,
  isTelegramUrl,
  isTwitterProfileUrl,
  isZhihuProfileUrl,
  parseZhihuProfileUrl,
} from '~/lib/link-parser'

import { FloatPopover } from '../float-popover'
import { Favicon } from '../rich-link/Favicon'
import { RichLink } from '../rich-link/RichLink'

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
      case isZhihuProfileUrl(url): {
        parsedType = 'ZH'
        parsedName = parseZhihuProfileUrl(url).id
        break
      }
    }
  } catch {
    /* empty */
  }

  const showRichLink = !!parsedType && !!parsedName

  return (
    <FloatPopover
      as="span"
      wrapperClassName="!inline"
      type="tooltip"
      TriggerComponent={useCallback(
        () => (
          <span className="inline items-center">
            {!showRichLink && <Favicon href={href} />}
            {showRichLink ? (
              <RichLink
                name={text || parsedName}
                source={parsedType}
                href={href}
              />
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

            <i className="icon-[mingcute--external-link-line] translate-y-[2px]" />
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
          text,
        ],
      )}
    >
      <span>{href}</span>
    </FloatPopover>
  )
})
MLink.displayName = 'MLink'
