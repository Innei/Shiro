import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

import { NoteLeftSidebar } from '~/components/widgets/note/NoteLeftSidebar'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'

export default async (props: PropsWithChildren) => {
  return (
    <div
      className={clsx(
        'relative mx-auto grid min-h-[calc(100vh-6.5rem-10rem)] max-w-[60rem]',
        'gap-4 md:grid-cols-1 lg:max-w-[calc(60rem+400px)] lg:grid-cols-[1fr_minmax(auto,60rem)_1fr]',
        'mt-12 md:mt-24',
      )}
    >
      <div className="relative hidden min-w-0 lg:block">
        <NoteLeftSidebar />
      </div>

      {props.children}

      <LayoutRightSideProvider className="relative hidden lg:block" />
    </div>
  )
}
