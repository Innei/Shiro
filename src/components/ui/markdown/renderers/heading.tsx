import { createElement } from 'react'
import type { DOMAttributes } from 'react'

import { springScrollToElement } from '~/lib/scroller'

interface HeadingProps {
  id: string
  className?: string
  children: React.ReactNode
  level: number
}

export const MHeader = (props: HeadingProps) => {
  const { children, id, level } = props

  return createElement<DOMAttributes<HTMLHeadingElement>, HTMLHeadingElement>(
    `h${level}`,
    {
      id,
      className: 'group flex items-center',
    } as any,
    null,
    <>
      <span>{children}</span>
      <span
        className="ml-2 inline-flex cursor-pointer select-none text-accent opacity-0 transition-opacity duration-200 center group-hover:opacity-100"
        role="button"
        tabIndex={0}
        aria-hidden
        onClick={() => {
          const state = history.state
          history.replaceState(state, '', `#${id}`)
          springScrollToElement(document.getElementById(id)!, -100)
        }}
      >
        <i className="icon-[mingcute--hashtag-line]" />
      </span>
    </>,
  )
}
