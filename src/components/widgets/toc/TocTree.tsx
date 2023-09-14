'use client'

import React, {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import clsx from 'clsx'
import { m } from 'framer-motion'
import { atom, useAtom } from 'jotai'
import type { FC } from 'react'
import type { TocSharedProps } from './TocAside'
import type { ITocItem } from './TocItem'

import { Divider } from '~/components/ui/divider'
import { RightToLeftTransitionView } from '~/components/ui/transition/RightToLeftTransitionView'
import { useStateToRef } from '~/hooks/common/use-state-ref'
import { useMaskScrollArea } from '~/hooks/shared/use-mask-scrollarea'
import { clsxm } from '~/lib/helper'
import { springScrollToElement } from '~/lib/scroller'

import { TocItem } from './TocItem'

const tocActiveIdAtom = atom<string | null>(null)

function useActiveId($headings: HTMLHeadingElement[]) {
  const [activeId, setActiveId] = useAtom(tocActiveIdAtom)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTransition(() => {
              setActiveId(entry.target.id)
            })
          }
        })
      },
      { rootMargin: `-100px 0px -100px 0px` },
    )
    $headings.forEach(($heading) => {
      observer.observe($heading)
    })
    return () => {
      observer.disconnect()
    }
  }, [$headings])

  return [activeId, setActiveId] as const
}

export const TocTree: Component<
  {
    $headings: HTMLHeadingElement[]
    containerRef?: React.MutableRefObject<HTMLUListElement | null>
    /**
     * 下次循环中跳转，在 Modal 中很管用
     */
    scrollInNextTick?: boolean

    onItemClick?: (item: ITocItem) => void
  } & TocSharedProps
> = ({
  $headings,
  containerRef,
  className,
  accessory,
  scrollInNextTick,
  onItemClick,
}) => {
  const [activeId, setActiveId] = useActiveId($headings)

  const toc: ITocItem[] = useMemo(() => {
    return Array.from($headings).map((el, idx) => {
      const depth = +el.tagName.slice(1)
      const title = el.textContent || ''

      const index = idx

      return {
        depth,
        index: isNaN(index) ? -1 : index,
        title,
        anchorId: el.id,
        $heading: el,
      }
    })
  }, [$headings])

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

  const tocRef = useStateToRef(toc)
  const handleScrollTo = useCallback(
    (i: number, $el: HTMLElement | null, anchorId: string) => {
      onItemClick?.(tocRef.current[i])

      if ($el) {
        const handle = () => {
          springScrollToElement($el, -100).then(() => {
            setActiveId?.(anchorId)
          })
        }
        if (scrollInNextTick) {
          requestAnimationFrame(() => {
            handle()
          })
        } else handle()
      }
    },
    [],
  )
  const accessoryElement = useMemo(() => {
    if (!accessory) return null
    return React.isValidElement(accessory)
      ? accessory
      : React.createElement(accessory as FC)
  }, [accessory])

  const [scrollContainerRef, scrollClassname] =
    useMaskScrollArea<HTMLUListElement>()

  return (
    <ul
      className={clsxm(
        'flex flex-grow flex-col px-2 scrollbar-none',
        className,
      )}
      ref={containerRef}
    >
      <ul
        className={clsx('overflow-auto scrollbar-none', scrollClassname)}
        ref={scrollContainerRef}
      >
        {toc?.map((heading) => {
          return (
            <MemoedItem
              heading={heading}
              isActive={heading.anchorId === activeId}
              key={heading.title}
              rootDepth={rootDepth}
              onClick={handleScrollTo}
            />
          )
        })}
      </ul>
      {accessoryElement && (
        <li className="flex-shrink-0">
          {!!toc.length && <Divider />}
          {accessoryElement}
        </li>
      )}
    </ul>
  )
}
const MemoedItem = memo<{
  isActive: boolean
  heading: ITocItem
  rootDepth: number
  onClick?: (i: number, $el: HTMLElement | null, anchorId: string) => void
}>((props) => {
  const {
    heading,
    isActive,
    onClick,
    rootDepth,
    // containerRef
  } = props

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
      className="relative leading-none"
    >
      {isActive && (
        <m.span
          layoutId="active-toc-item"
          layout
          className="absolute bottom-[3px] left-0 top-[3px] w-[2px] rounded-sm bg-accent"
        />
      )}
      <TocItem
        heading={heading}
        onClick={onClick}
        active={isActive}
        key={heading.title}
        rootDepth={rootDepth}
      />
    </RightToLeftTransitionView>
  )
})
MemoedItem.displayName = 'MemoedItem'
