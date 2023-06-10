import type { PropsWithChildren } from 'react'

import { NoteTimelineSidebar } from '~/components/widgets/note/NoteTimelineSidebar'

export default async (props: PropsWithChildren) => {
  return (
    <div className="relative mx-auto min-h-screen max-w-7xl lg:px-8">
      <NoteTimelineSidebar />

      <div className="relative m-auto max-w-[50rem]">{props.children}</div>
    </div>
  )
}
