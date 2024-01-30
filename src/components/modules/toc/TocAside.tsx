'use client'

import React, {
  forwardRef,
  startTransition,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { useForceUpdate } from 'framer-motion'

import { DOMCustomEvents } from '~/constants/event'
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
export interface TocAsideRef {
  getContainer: () => HTMLUListElement | null
}
export const TocAside = forwardRef<
  TocAsideRef,
  TocAsideProps & TocSharedProps & ComponentType
>(
  (
    { className, children, treeClassName, accessory, as: As = 'aside' },
    ref,
  ) => {
    const containerRef = useRef<HTMLUListElement>(null)
    const $article = useWrappedElement()

    const [forceUpdate, updated] = useForceUpdate()

    useEffect(() => {
      const handler = () => {
        startTransition(() => {
          forceUpdate()
        })
      }
      document.addEventListener(DOMCustomEvents.RefreshToc, handler)
      return () => {
        document.removeEventListener(DOMCustomEvents.RefreshToc, handler)
      }
    }, [])

    useImperativeHandle(ref, () => ({
      getContainer: () => containerRef.current,
    }))

    if (typeof $article === 'undefined') {
      throw new Error('<Toc /> must be used in <WrappedElementProvider />')
    }
    const $headings = useMemo(() => {
      if (!$article) {
        return []
      }
      return [...$article.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(
        ($heading) => {
          if (($heading as HTMLElement).dataset['markdownHeading'] === 'true')
            return true
          return false
        },
      ) as HTMLHeadingElement[]
    }, [$article, updated])

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
  },
)
TocAside.displayName = 'TocAside'
