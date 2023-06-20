import { memo, useCallback } from 'react'
import Router from 'next/router'
import type { FC } from 'react'

import { FloatPopover } from '../../float-popover'
import styles from './link.module.css'

const ExtendIcon = () => (
  <svg
    style={{
      transform: `translateY(-2px)`,
      marginLeft: `2px`,
    }}
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 100 100"
    width="15"
    height="15"
    className="inline align-middle leading-normal"
  >
    <path
      fill="var(--shizuku-text-color)"
      d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
    />
    <polygon
      fill="var(--shizuku-text-color)"
      points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
    />
  </svg>
)
export const MLink: FC<{
  href: string
  title?: string
  children?: JSX.Element | JSX.Element[]
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
      wrapperClassNames="!inline"
      TriggerComponent={() => (
        <>
          <a
            className={styles['anchor']}
            href={props.href}
            target="_blank"
            onClick={handleRedirect}
            title={props.title}
          >
            {props.children}
          </a>

          {ExtendIcon}
        </>
      )}
    >
      <span>{props.href}</span>
    </FloatPopover>
  )
})
