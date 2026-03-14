'use client'

import type { CommentModel } from '@mx-space/api-client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useIsMobile } from '~/atoms/hooks/viewport'
import { Avatar } from '~/components/ui/avatar'
import { PresentSheet } from '~/components/ui/sheet'

import { resolveRangeAnchor } from './anchor-resolve'
import type { BlockInfo } from './anchor-utils'
import { buildBlockAnchorFromIndex } from './anchor-utils'
import { CommentBlockThread } from './CommentBlockThread'
import { useRichContentElement } from './RichContentElementContext'
import type { CommentAnchor } from './types'

type CommentWithAnchor = CommentModel & { anchor?: CommentAnchor }

interface CommentBlockGutterProps {
  blockInfos: BlockInfo[]
  comments: CommentWithAnchor[]
  containerRef: React.RefObject<HTMLElement | null>
  currentLang?: string | null
  refId: string
}

function AvatarStack({
  comments,
  size = 22,
}: {
  comments: CommentWithAnchor[]
  size?: number
}) {
  const uniqueAvatars = useMemo(() => {
    const seen = new Set<string>()
    const result: { avatar?: string; author: string }[] = []
    for (const c of comments) {
      const key = c.avatar || c.author
      if (!seen.has(key)) {
        seen.add(key)
        result.push({ avatar: c.avatar, author: c.author })
      }
    }
    return result.slice(0, 3)
  }, [comments])

  return (
    <div className="flex items-center -space-x-1.5">
      {uniqueAvatars.map((u) => (
        <Avatar
          className="rounded-full ring-2 ring-neutral-50 dark:ring-neutral-900"
          imageUrl={u.avatar}
          key={u.avatar || u.author}
          radius="full"
          shadow={false}
          size={size}
          text={u.author}
        />
      ))}
    </div>
  )
}

function DesktopGutterTrigger({
  blockComments,
  top,
  isHovered,
  isActive,
  onClick,
}: {
  blockComments: CommentWithAnchor[]
  top: number
  isHovered: boolean
  isActive: boolean
  onClick: () => void
}) {
  const hasComments = blockComments.length > 0

  return (
    <div
      className="absolute left-0 flex items-start"
      style={{ top: `${top}px` }}
    >
      {hasComments ? (
        <button
          className="flex cursor-pointer items-center gap-1 rounded-full py-0.5 pl-0.5 pr-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          type="button"
          onClick={onClick}
        >
          <AvatarStack comments={blockComments} />
          <span className="ml-0.5 text-[11px] font-medium text-muted-foreground">
            {blockComments.length}
          </span>
        </button>
      ) : (
        <button
          type="button"
          className={`flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800 ${
            isHovered || isActive ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClick}
        >
          <i className="i-mingcute-comment-line text-[15px]" />
        </button>
      )}
    </div>
  )
}

function MobileGutterItem({
  blockIndex,
  blockComments,
  blockInfos,
  refId,
  top,
  lang,
  onOpen,
  onClose,
}: {
  blockIndex: number
  blockComments: CommentWithAnchor[]
  blockInfos: BlockInfo[]
  refId: string
  top: number
  lang?: string | null
  onOpen: () => void
  onClose: () => void
}) {
  const anchor = buildBlockAnchorFromIndex(blockInfos, blockIndex, lang)

  if (!anchor) return null

  return (
    <div
      className="absolute -right-1 flex items-start"
      style={{ top: `${top}px` }}
    >
      <PresentSheet
        triggerAsChild
        title="评论"
        content={
          <CommentBlockThread
            anchor={anchor!}
            comments={blockComments}
            refId={refId}
          />
        }
        onOpenChange={(open) => {
          if (open) onOpen()
          else onClose()
        }}
      >
        <button
          className="flex cursor-pointer items-center gap-0.5 rounded-full border border-neutral-200/80 bg-neutral-50/90 py-0.5 pl-0.5 pr-1.5 shadow-sm backdrop-blur-sm dark:border-neutral-700/80 dark:bg-neutral-900/90"
          type="button"
        >
          <AvatarStack comments={blockComments} size={20} />
          <span className="text-[10px] font-medium text-muted-foreground">
            {blockComments.length}
          </span>
        </button>
      </PresentSheet>
    </div>
  )
}

interface ActivePanel {
  blockId: string
  blockIndex: number
}

export function CommentBlockGutter({
  containerRef,
  blockInfos,
  comments,
  refId,
  currentLang,
}: CommentBlockGutterProps) {
  const isMobile = useIsMobile()
  const contentEl = useRichContentElement()

  const commentsByBlock = useMemo(() => {
    const map = new Map<string, CommentWithAnchor[]>()
    for (const c of comments) {
      const { anchor } = c
      if (!anchor?.blockId) continue
      const anchorLang = (anchor as CommentAnchor).lang ?? null
      const isBlock = anchor.mode === 'block'
      const langMatch = anchorLang === currentLang
      if (isBlock || !langMatch) {
        const arr = map.get(anchor.blockId) || []
        arr.push(c)
        map.set(anchor.blockId, arr)
      } else if (anchor.mode === 'range') {
        // Range anchor with matching lang — check if it falls back to block level
        const resolved = resolveRangeAnchor(anchor, blockInfos)
        if (
          resolved.status === 'block-fallback' &&
          resolved.blockIndex !== -1
        ) {
          const blockId = blockInfos[resolved.blockIndex]?.blockId
          if (blockId) {
            const arr = map.get(blockId) || []
            arr.push(c)
            map.set(blockId, arr)
          }
        }
      }
    }
    return map
  }, [comments, currentLang, blockInfos])

  const [blockPositions, setBlockPositions] = useState<Map<number, number>>(
    () => new Map(),
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container || !contentEl) return

    const updatePositions = () => {
      const containerRect = container.getBoundingClientRect()
      const positions = new Map<number, number>()
      for (let i = 0; i < contentEl.children.length; i++) {
        const child = contentEl.children[i] as HTMLElement
        const rect = child.getBoundingClientRect()
        positions.set(i, rect.top - containerRect.top)
      }
      setBlockPositions(new Map(positions))
    }

    updatePositions()
    const observer = new ResizeObserver(updatePositions)
    observer.observe(contentEl)

    return () => observer.disconnect()
  }, [containerRef, contentEl, blockInfos])

  const [hoverIndex, setHoverIndex] = useState(-1)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!contentEl) return

      for (let i = 0; i < contentEl.children.length; i++) {
        const child = contentEl.children[i] as HTMLElement
        const rect = child.getBoundingClientRect()
        if (e.clientY >= rect.top && e.clientY < rect.bottom) {
          setHoverIndex(i)
          return
        }
      }
      setHoverIndex(-1)
    },
    [contentEl],
  )

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(-1)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [containerRef, handleMouseMove, handleMouseLeave, isMobile])

  // Panel state
  const [activePanel, setActivePanel] = useState<ActivePanel | null>(null)
  const prevActiveRef = useRef<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  const activeBlockId = activePanel?.blockId ?? null

  const resolveBlockIndex = useCallback(
    (id: string | null): number => {
      if (!id) return -1
      const idx = blockInfos.findIndex((b) => b.blockId === id)
      if (idx !== -1) return idx
      if (id.startsWith('__idx_')) {
        return Number.parseInt(id.slice(6), 10)
      }
      return -1
    },
    [blockInfos],
  )

  // Block highlight
  useEffect(() => {
    if (!contentEl) return

    const prevIdx = resolveBlockIndex(prevActiveRef.current)
    if (prevIdx !== -1) {
      contentEl.children[prevIdx]?.classList.remove('comment-block-active')
    }

    const idx = resolveBlockIndex(activeBlockId)
    if (idx !== -1) {
      contentEl.children[idx]?.classList.add('comment-block-active')
    }

    prevActiveRef.current = activeBlockId
  }, [activeBlockId, contentEl, resolveBlockIndex])

  useEffect(() => {
    return () => {
      if (!contentEl) return
      for (const child of contentEl.children) {
        child.classList.remove('comment-block-active')
      }
    }
  }, [contentEl])

  // Click outside panel to close
  useEffect(() => {
    if (!activePanel) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      if (gutterRef.current?.contains(target)) return
      setActivePanel(null)
    }
    const rafId = requestAnimationFrame(() => {
      document.addEventListener('mousedown', handler)
    })
    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousedown', handler)
    }
  }, [activePanel])

  // Escape to close
  useEffect(() => {
    if (!activePanel) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanel(null)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [activePanel])

  const handleGutterClick = useCallback(
    (blockIndex: number, blockId: string) => {
      const anchor = buildBlockAnchorFromIndex(
        blockInfos,
        blockIndex,
        currentLang,
      )
      if (!anchor) return
      setActivePanel((prev) =>
        prev?.blockId === blockId ? null : { blockIndex, blockId },
      )
    },
    [blockInfos, currentLang],
  )

  const gutterItems = useMemo(() => {
    const items: {
      blockIndex: number
      blockId: string
      comments: CommentWithAnchor[]
      isGhost: boolean
    }[] = []

    for (const [blockId, blockComments] of commentsByBlock) {
      const blockIdx = blockInfos.findIndex((b) => b.blockId === blockId)
      if (blockIdx !== -1) {
        items.push({
          blockIndex: blockIdx,
          blockId,
          comments: blockComments,
          isGhost: false,
        })
      }
    }

    if (!isMobile && hoverIndex !== -1) {
      const info = blockInfos[hoverIndex]
      if (info && !commentsByBlock.has(info.blockId || `__idx_${hoverIndex}`)) {
        items.push({
          blockIndex: hoverIndex,
          blockId: info.blockId || `__idx_${hoverIndex}`,
          comments: [],
          isGhost: true,
        })
      }
    }

    return items
  }, [commentsByBlock, blockInfos, hoverIndex, isMobile])

  // Mobile: only show blocks with comments
  if (isMobile) {
    const commentItems = gutterItems.filter((item) => !item.isGhost)
    if (commentItems.length === 0) return null

    return (
      <div className="absolute inset-0 pointer-events-none">
        {commentItems.map((item) => {
          const top = blockPositions.get(item.blockIndex)
          if (top === undefined) return null

          return (
            <div className="pointer-events-auto" key={item.blockId}>
              <MobileGutterItem
                blockComments={item.comments}
                blockIndex={item.blockIndex}
                blockInfos={blockInfos}
                lang={currentLang}
                refId={refId}
                top={top}
                onClose={() => setActivePanel(null)}
                onOpen={() =>
                  setActivePanel({
                    blockIndex: item.blockIndex,
                    blockId: item.blockId,
                  })
                }
              />
            </div>
          )
        })}
      </div>
    )
  }

  const panelTop = activePanel
    ? blockPositions.get(activePanel.blockIndex)
    : undefined
  const panelAnchor = activePanel
    ? buildBlockAnchorFromIndex(blockInfos, activePanel.blockIndex, currentLang)
    : null
  const panelComments = activePanel
    ? commentsByBlock.get(activePanel.blockId) || []
    : []

  return (
    <div
      className="absolute top-0 bottom-0 right-0 hidden w-8 lg:block z-10"
      ref={gutterRef}
    >
      {gutterItems.map((item) => {
        const top = blockPositions.get(item.blockIndex)
        if (top === undefined) return null

        return (
          <DesktopGutterTrigger
            blockComments={item.comments}
            isActive={activeBlockId === item.blockId}
            isHovered={hoverIndex === item.blockIndex}
            key={item.blockId}
            top={top}
            onClick={() => handleGutterClick(item.blockIndex, item.blockId)}
          />
        )
      })}

      {activePanel && panelAnchor && panelTop !== undefined && (
        <div
          className="absolute -left-2 ml-2 z-20 rounded-xl border border-neutral-200/80 bg-neutral-50 shadow-lg overflow-hidden dark:border-neutral-700/80 dark:bg-neutral-900"
          ref={panelRef}
          style={{ top: `${panelTop}px` }}
        >
          <CommentBlockThread
            anchor={panelAnchor}
            comments={panelComments}
            refId={refId}
            onClose={() => setActivePanel(null)}
          />
        </div>
      )}
    </div>
  )
}
