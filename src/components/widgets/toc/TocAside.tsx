'use client'

import React, { useEffect, useMemo, useRef } from 'react'

import { throttle } from '~/lib/_'
import { clsxm } from '~/lib/helper'
import { useWrappedElement } from '~/providers/shared/WrappedElementProvider'

import { TocTree } from './TocTree'

export type TocAsideProps = {
  treeClassName?: string
}

export interface TocSharedProps {
  accessory?: React.ReactNode | React.FC

  as?: React.ElementType
}
export const TocAside: Component<TocAsideProps & TocSharedProps> = ({
  className,
  children,
  treeClassName,
  accessory,
  as: As = 'aside',
}) => {
  const containerRef = useRef<HTMLUListElement>(null)
  const $article = useWrappedElement()

  if (typeof $article === 'undefined') {
    throw new Error('<Toc /> must be used in <WrappedElementProvider />')
  }
  const $headings = useMemo(() => {
    if (!$article) {
      return []
    }

    return [
      ...$article.querySelectorAll('h1,h2,h3,h4,h5,h6'),
    ] as HTMLHeadingElement[]
  }, [$article])

  useEffect(() => {
    const setMaxWidth = throttle(() => {
      if (containerRef.current) {
        containerRef.current.style.maxWidth = `${
          window.innerWidth -
          containerRef.current.getBoundingClientRect().x -
          30
        }px`
      }
    }, 14)
    setMaxWidth()

    window.addEventListener('resize', setMaxWidth)
    return () => {
      window.removeEventListener('resize', setMaxWidth)
    }
  }, [])

  return (
    <As className={clsxm('st-toc z-[3]', 'relative font-sans', className)}>
      <TocTree
        $headings={$headings}
        containerRef={containerRef}
        className={clsxm('absolute max-h-[75vh]', treeClassName)}
        accessory={accessory}
      />
      {children}
    </As>
  )
}
