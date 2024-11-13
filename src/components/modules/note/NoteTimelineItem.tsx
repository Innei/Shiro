'use client'

import type { Target, TargetAndTransition } from 'motion/react'
import { m } from 'motion/react'
import Link from 'next/link'
import { memo } from 'react'
import { tv } from 'tailwind-variants'

import { LeftToRightTransitionView } from '~/components/ui/transition'
import { getToken } from '~/lib/cookie'
import { clsxm } from '~/lib/helper'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { springScrollToTop } from '~/lib/scroller'

const styles = tv({
  base: 'text-neutral-content min-w-0 truncate text-left opacity-50 transition-all tabular-nums hover:opacity-80',
  variants: {
    status: {
      active: 'ml-2 opacity-100',
    },
  },
})
const initialLi: Target = {
  opacity: 0.0001,
}
const animateLi: TargetAndTransition = {
  opacity: 1,
}

export const NoteTimelineItem = memo<{
  active: boolean
  title: string
  nid: number
  attachToken: boolean

  layout?: boolean
}>((props) => {
  const { active, nid, title, layout, attachToken } = props

  const href = routeBuilder(Routes.Note, {
    id: nid,
  })
  return (
    <m.li
      layout={layout}
      className="flex items-center"
      layoutId={layout ? `note-${nid}` : undefined}
      initial={initialLi}
      animate={animateLi}
      exit={initialLi}
    >
      {active && (
        <LeftToRightTransitionView
          as="span"
          className="inline-flex items-center"
        >
          <i className="i-material-symbols-arrow-circle-right-outline-rounded duration-200" />
        </LeftToRightTransitionView>
      )}
      <Link
        onClick={springScrollToTop}
        className={clsxm(
          active
            ? styles({
                status: 'active',
              })
            : styles(),
        )}
        href={attachToken ? `${href}?token=${getToken()}` : href}
        scroll={false}
      >
        {title}
      </Link>
    </m.li>
  )
})
NoteTimelineItem.displayName = 'MemoedItem'
