'use client'

import type { CommentModel } from '@mx-space/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'

import { Avatar } from '~/components/ui/avatar'
import { RelativeTime } from '~/components/ui/relative-time'
import { ScrollArea } from '~/components/ui/scroll-area'

import { CommentBoxRoot } from './CommentBox/Root'
import type { CommentAnchor } from './types'

type CommentWithAnchor = CommentModel & { anchor?: CommentAnchor }

interface CommentBlockThreadProps {
  anchor: CommentAnchor
  comments: CommentWithAnchor[]
  onClose?: () => void
  refId: string
}

function ThreadComment({ comment }: { comment: CommentWithAnchor }) {
  const { avatar, author } = comment

  return (
    <div className="flex gap-2 px-3 py-2">
      <Avatar
        className="shrink-0 rounded-full"
        imageUrl={avatar}
        radius="full"
        shadow={false}
        size={24}
        text={author}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[13px] font-semibold text-foreground/90">
            {author}
          </span>
          <span className="text-[11px] text-muted-foreground">
            <RelativeTime date={comment.created} />
          </span>
        </div>
        {comment.anchor?.mode === 'range' && (
          <div className="mt-0.5 border-l-2 border-accent/40 pl-2 text-xs italic text-muted-foreground">
            {comment.anchor.quote}
          </div>
        )}
        <p className="mt-0.5 text-[13px] leading-relaxed text-foreground/80">
          {comment.text}
        </p>
      </div>
    </div>
  )
}

export function CommentBlockThread({
  comments,
  refId,
  anchor,
  onClose,
}: CommentBlockThreadProps) {
  const queryClient = useQueryClient()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = containerRef.current?.querySelector<HTMLElement>(
        '[contenteditable="true"]',
      )
      el?.focus()
    }, 50)
    return () => clearTimeout(timer)
  }, [anchor])

  const handleAfterSubmit = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['comments', refId, 'anchors'],
    })
    onClose?.()
  }, [queryClient, refId, onClose])

  return (
    <div className="w-[400px] min-w-0 overflow-hidden" ref={containerRef}>
      {comments.length > 0 && (
        <ScrollArea.ScrollArea
          rootClassName="max-h-80"
          viewportClassName="py-1"
        >
          {comments.map((comment) => (
            <ThreadComment comment={comment} key={comment.id} />
          ))}
        </ScrollArea.ScrollArea>
      )}
      <div className={comments.length > 0 ? 'border-t border-border/50' : ''}>
        <CommentBoxRoot
          compact
          afterSubmit={handleAfterSubmit}
          anchor={anchor}
          className="px-3 py-2.5"
          refId={refId}
        />
      </div>
    </div>
  )
}
