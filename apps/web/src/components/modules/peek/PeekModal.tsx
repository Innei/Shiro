'use client'

import { m } from 'motion/react'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { ImpressionView } from '~/components/common/ImpressionTracker'
import { useModalStack } from '~/components/ui/modal'
import { microReboundPreset } from '~/constants/spring'
import { TrackerAction } from '~/constants/tracker'
import { Link } from '~/i18n/navigation'

export const PeekModal = (
  props: PropsWithChildren<{
    to: string
  }>,
) => {
  const { dismissAll, dismissTop } = useModalStack()
  const { to, children } = props

  useEffect(() => {
    history.replaceState({}, '', `?peek-to=${to}`)

    return () => {
      history.replaceState({}, '', location.pathname)
    }
  }, [to])
  return (
    <div className="scrollbar-none relative mx-auto mt-[10vh] max-w-full px-2 lg:max-w-[65rem] lg:p-0">
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
        {children}
      </m.div>

      <m.div
        initial={true}
        exit={{
          opacity: 0,
        }}
        className="fixed right-2 top-2 flex items-center gap-4"
      >
        <Link
          className="center flex size-8 rounded-full p-1 shadow-xs ring-1 ring-zinc-200 dark:ring-neutral-800"
          href={to}
          onClick={dismissAll}
        >
          <i className="i-mingcute-fullscreen-2-line text-lg" />
          <span className="sr-only">Go to this link</span>
        </Link>

        <button
          className="center flex size-8 rounded-full p-1 shadow-xs ring-1 ring-zinc-200 dark:ring-neutral-800"
          onClick={dismissTop}
        >
          <i className="i-mingcute-close-line text-lg" />
          <span className="sr-only">Dimiss</span>
        </button>
      </m.div>
    </div>
  )
}
