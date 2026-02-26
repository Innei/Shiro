'use client'

import { m } from 'motion/react'
import type * as React from 'react'
import {
  startTransition,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import { useIsImmersiveReadingEnabled } from '~/atoms/hooks/reading'
import { DOMCustomEvents } from '~/constants/event'
import { Spring } from '~/constants/spring'
import { useForceUpdate } from '~/hooks/common/use-force-update'
import { clsxm } from '~/lib/helper'
import { throttle } from '~/lib/lodash'
import { useWrappedElement } from '~/providers/shared/WrappedElementProvider'

import { useTocHeadingStrategy } from './TocHeadingStrategy'
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
export const TocAside = ({
  ref,
  className,
  children,
  treeClassName,
  accessory,
  as: As = 'aside',
}: TocAsideProps &
  TocSharedProps &
  ComponentType & { ref?: React.RefObject<TocAsideRef | null> }) => {
  const containerRef = useRef<HTMLUListElement>(null)
  const $article = useWrappedElement()
  const isImmersive = useIsImmersiveReadingEnabled()

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

  if ($article === undefined) {
    throw new TypeError('<Toc /> must be used in <WrappedElementProvider />')
  }
  const queryHeadings = useTocHeadingStrategy()
  const $headings = useMemo(() => {
    if (!$article) {
      return []
    }
    return queryHeadings($article)
  }, [$article, updated, queryHeadings])

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
    <m.aside
      className={clsxm('st-toc z-[3]', 'relative font-sans', className)}
      animate={{
        opacity: isImmersive ? 0.2 : 1,
      }}
      transition={Spring.presets.smooth}
      style={{
        pointerEvents: isImmersive ? 'none' : 'auto',
      }}
    >
      <TocTree
        $headings={$headings}
        containerRef={containerRef}
        className={clsxm('absolute max-h-[75vh]', treeClassName)}
        accessory={accessory}
      />
      {children}
    </m.aside>
  )
}
TocAside.displayName = 'TocAside'
