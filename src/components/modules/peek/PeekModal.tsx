import { m } from 'framer-motion'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'

import { ImpressionView } from '~/components/common/ImpressionTracker'
import { useModalStack } from '~/components/ui/modal'
import { microReboundPreset } from '~/constants/spring'
import { TrackerAction } from '~/constants/tracker'

export const PeekModal = (
  props: PropsWithChildren<{
    to: string
  }>,
) => {
  const { dismissAll, dismissTop } = useModalStack()

  return (
    <div className="relative mx-auto mt-[10vh] max-w-full overflow-auto px-2 scrollbar-none lg:max-w-[65rem] lg:p-0">
      <ImpressionView
        action={TrackerAction.Impression}
        trackerMessage="Peek Modal"
      />
      <m.div
        initial={{ opacity: 0.5, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={microReboundPreset}
        className="scrollbar-none"
      >
        {props.children}
      </m.div>

      <m.div
        initial={true}
        exit={{
          opacity: 0,
        }}
        className="fixed right-2 top-2 flex items-center gap-4"
      >
        <Link
          className="flex size-8 rounded-full p-1 shadow-sm ring-1 ring-zinc-200 center dark:ring-neutral-800"
          href={props.to}
          onClick={dismissAll}
        >
          <i className="icon-[mingcute--fullscreen-2-line] text-lg" />
          <span className="sr-only">Go to this link</span>
        </Link>

        <button
          className="flex size-8 rounded-full p-1 shadow-sm ring-1 ring-zinc-200 center dark:ring-neutral-800"
          onClick={dismissTop}
        >
          <i className="icon-[mingcute--close-line] text-lg" />
          <span className="sr-only">Dimiss</span>
        </button>
      </m.div>
    </div>
  )
}
