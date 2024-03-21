import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

import { NoteLeftSidebar } from '~/components/modules/note/NoteLeftSidebar'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'

export default async (props: PropsWithChildren) => {
  return (
    <div
      className={clsx(
        'relative mx-auto grid min-h-[calc(100vh-6.5rem-10rem)] max-w-[60rem]',
        'gap-4 md:grid-cols-1 xl:max-w-[calc(60rem+400px)] xl:grid-cols-[1fr_minmax(auto,60rem)_1fr]',
        'mt-12',
        'md:mt-24 print:!block print:!max-w-full',
      )}
    >
      <div className="relative hidden min-w-0 xl:block" data-hide-print>
        <NoteLeftSidebar />
      </div>

      {props.children}

      <LayoutRightSideProvider className="relative hidden xl:block print:!hidden" />
    </div>
  )
}
