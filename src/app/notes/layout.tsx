import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

import { NoteLeftSidebar } from '~/components/widgets/note/NoteLeftSidebar'
import { CurrentNoteIdProvider } from '~/providers/note/current-note-id-provider'
import { NoteLayoutRightSideProvider } from '~/providers/note/right-side-provider'

export default async (props: PropsWithChildren) => {
  return (
    <CurrentNoteIdProvider>
      <div
        className={clsx(
          'relative mx-auto grid min-h-screen max-w-[60rem]',
          'gap-4 md:grid-cols-1 lg:max-w-[calc(60rem+400px)] lg:grid-cols-[1fr_minmax(auto,60rem)_1fr]',
          'mt-24',
        )}
      >
        <NoteLeftSidebar className="relative hidden lg:block" />

        <main
          className={clsx(
            'relative bg-base-100 p-[30px_45px] md:col-start-1 lg:col-auto',
            'rounded-[0_6px_6px_0] border border-[#bbb3]',
            'note-layout-main',
          )}
        >
          {props.children}
        </main>

        <NoteLayoutRightSideProvider className="relative hidden lg:block" />
      </div>
    </CurrentNoteIdProvider>
  )
}
