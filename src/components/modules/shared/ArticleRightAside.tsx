'use client'

import type { FC } from 'react'
import * as React from 'react'

import { useIsMobile } from '~/atoms/hooks'

import { TocAside } from '../toc'
import { ReadIndicator } from './ReadIndicator'

export const ArticleRightAside: Component = ({ children }) => {
  const isMobile = useIsMobile()
  if (isMobile) return <div />

  return <ArticleRightAsideImpl>{children}</ArticleRightAsideImpl>
}

const ArticleRightAsideImpl: FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  return (
    <aside className="sticky top-[120px] mt-[120px] h-[calc(100vh-6rem-4.5rem-150px-120px)]">
      <div className="relative h-full">
        <TocAside
          as="div"
          className="static ml-4"
          treeClassName="absolute h-full min-h-[120px] flex flex-col"
          accessory={ReadIndicator}
        />
      </div>
      {!!children &&
        React.cloneElement(children as any, {
          className: 'translate-y-[calc(100%+24px)]',
        })}
    </aside>
  )
}
