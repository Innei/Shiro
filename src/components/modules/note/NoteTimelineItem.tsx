'use client'

import { memo } from 'react'
import { m } from 'framer-motion'
import Link from 'next/link'
import { tv } from 'tailwind-variants'
import type { Target, TargetAndTransition } from 'framer-motion'

import { LeftToRightTransitionView } from '~/components/ui/transition'
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

  layout?: boolean
}>((props) => {
  const { active, nid, title, layout } = props

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
          <i className="icon-[material-symbols--arrow-circle-right-outline-rounded] duration-200" />
        </LeftToRightTransitionView>
      )}
      <Link
        onClick={springScrollToTop}
        prefetch={false}
        className={clsxm(
          active
            ? styles({
                status: 'active',
              })
            : styles(),
        )}
        href={routeBuilder(Routes.Note, {
          id: nid,
        })}
        scroll={false}
      >
        {title}
      </Link>
    </m.li>
  )
})
NoteTimelineItem.displayName = 'MemoedItem'
