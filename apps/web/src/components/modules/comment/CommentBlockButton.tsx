'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useModalStack } from '~/components/ui/modal'

import { CommentModal } from '../shared/CommentModal'
import type { BlockInfo } from './anchor-utils'
import { buildBlockAnchorFromIndex } from './anchor-utils'
import { useRichContentElement } from './RichContentElementContext'

export function CommentBlockButton({
  containerRef,
  blockInfos,
  refId,
  title,
}: {
  containerRef: React.RefObject<HTMLElement | null>
  blockInfos: BlockInfo[]
  refId: string
  title: string
}) {
  const contentEl = useRichContentElement()
  const [hoverIndex, setHoverIndex] = useState(-1)
  const [btnPos, setBtnPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const { present } = useModalStack()
  const t = useTranslations('common')

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current
      if (!container || !contentEl) return

      const { children } = contentEl
      const containerRect = container.getBoundingClientRect()

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement
        const rect = child.getBoundingClientRect()
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          setHoverIndex(i)
          setBtnPos({
            top: rect.top - containerRect.top + 4,
            right: 0,
          })
          return
        }
      }
      setHoverIndex(-1)
    },
    [containerRef, contentEl],
  )

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(-1)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [containerRef, handleMouseMove, handleMouseLeave])

  if (hoverIndex < 0) return null

  return (
    <button
      className="absolute z-10 flex size-6 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-500 opacity-0 transition-opacity hover:bg-accent/20 hover:text-accent group-hover/comment-block:opacity-100 dark:bg-neutral-700/80 dark:text-neutral-400"
      ref={btnRef}
      type="button"
      style={{
        top: btnPos.top,
        right: btnPos.right,
      }}
      onClick={() => {
        const anchor = buildBlockAnchorFromIndex(blockInfos, hoverIndex)
        present({
          title: t('selection_comment'),
          content: (rest) => (
            <CommentModal
              anchor={anchor}
              refId={refId}
              title={title}
              {...rest}
            />
          ),
        })
      }}
    >
      <i className="icon-[mingcute--comment-line] text-sm" />
    </button>
  )
}
