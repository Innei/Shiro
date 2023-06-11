import type { PropsWithChildren } from 'react'

import { NoteTimelineSidebar } from '~/components/widgets/note/NoteTimelineSidebar'

export default async (props: PropsWithChildren) => {
  return (
    <div className="relative mx-auto grid min-h-screen max-w-[50rem] gap-4 md:grid-cols-1 lg:max-w-[calc(50rem+400px)] lg:grid-cols-[1fr_minmax(auto,50rem)_1fr]">
      <NoteTimelineSidebar className="hidden lg:block" />

      <div className="relative md:col-start-1 lg:col-auto">
        {props.children}
      </div>
      <div className="hidden lg:block" />
    </div>
  )
}
