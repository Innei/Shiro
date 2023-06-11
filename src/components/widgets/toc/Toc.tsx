import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TocItem as ITocItem } from '~/remark'

import { RightToLeftTransitionView } from '~/components/ui/transition/RightToLeftTransitionView'
import { throttle } from '~/lib/_'
import { clsxm } from '~/utils/helper'

import { TocItem } from './TocItem'

export type TocProps = {
  toc: ITocItem[]

  useAsWeight?: boolean
}

export const Toc: Component<TocProps> = ({ toc, useAsWeight, className }) => {
  const containerRef = useRef<HTMLUListElement>(null)

  const [index, setIndex] = useState(-1)
  // useEffect(() => {
  //   const handler = (index: number) => {
  //     setIndex(index)
  //   }
  //   eventBus.on(CustomEventTypes.TOC, handler)
  //   return () => {
  //     eventBus.off(CustomEventTypes.TOC, handler)
  //   }
  // }, [])

  useEffect(() => {
    if (useAsWeight) {
      return
    }
    const setMaxWidth = throttle(() => {
      if (containerRef.current) {
        containerRef.current.style.maxWidth = `${
          document.documentElement.getBoundingClientRect().width -
          containerRef.current.getBoundingClientRect().x -
          60
        }px`
      }
    }, 14)
    setMaxWidth()

    window.addEventListener('resize', setMaxWidth)
    return () => {
      window.removeEventListener('resize', setMaxWidth)
    }
  }, [useAsWeight])

  const handleItemClick = useCallback((i: number) => {
    setTimeout(() => {
      setIndex(i)
    }, 350)
  }, [])

  const rootDepth = useMemo(
    () =>
      toc?.length
        ? (toc.reduce(
            (d: number, cur) => Math.min(d, cur.depth),
            toc[0]?.depth || 0,
          ) as any as number)
        : 0,
    [toc],
  )

  return (
    <aside className={clsxm('st-toc z-[3]', 'relative font-sans', className)}>
      <ul
        className="absolute max-h-[75vh] overflow-y-auto scrollbar-none"
        key={`${toc.map((i) => i.title).join('')}`}
        ref={containerRef}
      >
        {toc?.map((heading) => {
          return (
            <MemoedItem
              containerRef={useAsWeight ? undefined : containerRef}
              heading={heading}
              isActive={heading.index === index}
              onClick={handleItemClick}
              key={heading.title}
              rootDepth={rootDepth}
            />
          )
        })}
      </ul>
    </aside>
  )
}

const MemoedItem = memo<{
  isActive: boolean
  heading: ITocItem
  rootDepth: number
  onClick: (i: number) => void
  containerRef: any
}>((props) => {
  const { heading, isActive, onClick, rootDepth, containerRef } = props

  return (
    <RightToLeftTransitionView
      timeout={
        useRef({
          exit: 50,
          enter: 50 * heading.index,
        }).current
      }
      key={heading.title}
      as="li"
      className="leading-none"
    >
      <TocItem
        containerRef={containerRef}
        index={heading.index}
        onClick={onClick}
        active={isActive}
        depth={heading.depth}
        title={heading.title}
        key={heading.title}
        rootDepth={rootDepth}
      />
    </RightToLeftTransitionView>
  )
})

MemoedItem.displayName = 'MemoedItem'
