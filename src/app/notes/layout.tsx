import type { PropsWithChildren } from 'react'

import { NoteLeftSidebar } from '~/components/widgets/note/NoteLeftSidebar'
import { NoteIdProvider } from '~/providers/note/note-id-provider'
import { NoteLayoutRightSideProvider } from '~/providers/note/right-side-provider'
import { clsxm } from '~/utils/helper'

export default async (props: PropsWithChildren) => {
  return (
    <NoteIdProvider>
      <div
        className={clsxm(
          'relative mx-auto grid min-h-screen max-w-[50rem]',
          'gap-4 md:grid-cols-1 lg:max-w-[calc(50rem+400px)] lg:grid-cols-[1fr_minmax(auto,50rem)_1fr]',
          'mt-24',
        )}
      >
        <NoteLeftSidebar className="relative hidden lg:block" />

        <div className="relative md:col-start-1 lg:col-auto">
          {props.children}
        </div>

        <NoteLayoutRightSideProvider className="relative hidden lg:block" />
      </div>
    </NoteIdProvider>
  )
}
