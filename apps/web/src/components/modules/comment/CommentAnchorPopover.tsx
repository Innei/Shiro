'use client'

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom'
import clsx from 'clsx'
import { m } from 'motion/react'
import { useEffect, useMemo, useRef } from 'react'

import { RootPortal } from '~/components/ui/portal'
import useClickAway from '~/hooks/common/use-click-away'

import { CommentBlockThread } from './CommentBlockThread'
import type { CommentAnchor, RangeAnchor } from './types'

type CommentWithAnchor = import('@mx-space/api-client').CommentModel & {
  anchor?: CommentAnchor
}

export function CommentAnchorPopover({
  refId,
  contextElement,
  anchor,
  comments,
  range,
  onClose,
}: {
  refId: string
  contextElement: HTMLElement | null
  anchor: RangeAnchor
  comments: CommentWithAnchor[]
  range: Range
  onClose: () => void
}) {
  const popoverRef = useRef<HTMLDivElement>(null)

  const { refs, floatingStyles, update } = useFloating({
    strategy: 'fixed',
    placement: 'bottom-start',
    middleware: [offset(8), flip({ padding: 20 }), shift({ padding: 20 })],
    whileElementsMounted: (reference, floating, updateFn) =>
      autoUpdate(reference, floating, updateFn, {
        animationFrame: true,
      }),
  })

  const virtualReference = useMemo(
    () => ({
      getBoundingClientRect: () => {
        const rangeRect = range.getBoundingClientRect()
        if (rangeRect.width || rangeRect.height) {
          return rangeRect
        }
        return range.getClientRects().item(0) ?? rangeRect
      },
      contextElement: contextElement ?? undefined,
    }),
    [contextElement, range],
  )

  useEffect(() => {
    refs.setReference(virtualReference)
    update()
  }, [refs, update, virtualReference])

  useClickAway(popoverRef, onClose)

  return (
    <RootPortal>
      <div
        className="z-[99]"
        style={floatingStyles}
        ref={(el: HTMLDivElement | null) => {
          popoverRef.current = el
          refs.setFloating(el)
        }}
      >
        <m.div
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          initial={{ y: 10, opacity: 0 }}
          transition={{ type: 'tween', duration: 0.15 }}
          className={clsx(
            'rounded-xl border border-neutral-400/20 outline-hidden backdrop-blur-lg dark:border-neutral-500/30',
            'bg-neutral-50/80 shadow-perfect dark:bg-neutral-900/80',
          )}
        >
          <CommentBlockThread
            anchor={anchor}
            comments={comments}
            refId={refId}
            onClose={onClose}
          />
        </m.div>
      </div>
    </RootPortal>
  )
}
