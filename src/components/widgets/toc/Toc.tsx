import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { atom, useAtom } from 'jotai'
import type { FC } from 'react'
import type { ITocItem } from './TocItem'

import { Divider } from '~/components/ui/divider'
import { RightToLeftTransitionView } from '~/components/ui/transition/RightToLeftTransitionView'
import { throttle } from '~/lib/_'
import { useArticleElement } from '~/providers/article/article-element-provider'
import { clsxm } from '~/utils/helper'
import { springScrollToElement } from '~/utils/scroller'

import { TocItem } from './TocItem'

export type TocAsideProps = {
  treeClassName?: string
}

interface TocSharedProps {
  accessory?: React.ReactNode | React.FC
}
export const TocAside: Component<TocAsideProps & TocSharedProps> = ({
  className,
  children,
  treeClassName,
  accessory,
}) => {
  const containerRef = useRef<HTMLUListElement>(null)
  const $article = useArticleElement()

  if (typeof $article === 'undefined') {
    throw new Error('<Toc /> must be used in <ArticleElementContextProvider />')
  }
  const $headings = useMemo(() => {
    if (!$article) {
      return []
    }
    return [
      ...$article.querySelectorAll('h1,h2,h3,h4,h5,h6'),
    ] as HTMLHeadingElement[]
  }, [$article])

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
      }
    })
  }, [$headings])

  useEffect(() => {
    const setMaxWidth = throttle(() => {
      if (containerRef.current) {
        containerRef.current.style.maxWidth = `${
          document.documentElement.getBoundingClientRect().width -
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

  const [activeId, setActiveId] = useActiveId($headings)

  return (
    <aside className={clsxm('st-toc z-[3]', 'relative font-sans', className)}>
      <TocTree
        toc={toc}
        activeId={activeId}
        setActiveId={setActiveId}
        rootDepth={rootDepth}
        containerRef={containerRef}
        className={clsxm('absolute max-h-[75vh]', treeClassName)}
        accessory={accessory}
      />
      {children}
    </aside>
  )
}

const TocTree: Component<
  {
    toc: ITocItem[]
    activeId: string | null
    setActiveId: (id: string | null) => void
    rootDepth: number
    containerRef: React.MutableRefObject<HTMLUListElement | null>
  } & TocSharedProps
> = ({
  toc,
  activeId,
  setActiveId,
  rootDepth,
  containerRef,
  className,
  accessory,
}) => {
  const handleScrollTo = useCallback(
    (i: number, $el: HTMLElement | null, anchorId: string) => {
      if ($el) {
        springScrollToElement($el, -100).then(() => {
          setActiveId(anchorId)
        })
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
  return (
    <ul
      className={clsxm(
        'overflow-y-auto px-2 font-medium scrollbar-none',
        className,
      )}
      key={`${toc.map((i) => i.title).join('')}`}
      ref={containerRef}
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
      {accessoryElement && (
        <li>
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
  // containerRef: any
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
        <motion.span
          layoutId="active-toc-item"
          layout
          className="absolute -left-2 bottom-[3px] top-[3px] w-[2px] rounded-sm bg-accent"
        />
      )}
      <TocItem
        anchorId={heading.anchorId}
        // containerRef={containerRef}
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

const tocActiveIdAtom = atom<string | null>(null)

function useActiveId($headings: HTMLHeadingElement[]) {
  const [activeId, setActiveId] = useAtom(tocActiveIdAtom)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const state = history.state
            history.replaceState({ ...state }, '', `#${entry.target.id}`)
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `-100px 0px -100px 0px` },
    )
    $headings.forEach(($heading) => {
      observer.observe($heading)
    })
    return () => {
      $headings.forEach(($heading) => {
        observer.unobserve($heading)
      })

      observer.disconnect()
    }
  }, [$headings])

  return [activeId, setActiveId] as const
}
