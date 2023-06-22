'use client'

import { Divider } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

import { NoteTopicDetail, ToTopicLink } from './NoteTopicDetail'

// export const NoteTopicInfo = () => {
//   const noteId = useCurrentNoteId()
//   if (!noteId) return null
//   return <NoteTopicInfoImpl />
// }
export const NoteTopicInfo = () => {
  const topic = useCurrentNoteDataSelector((data) => data?.data.topic)

  if (!topic) return null

  return (
    <>
      <Divider className="!w-3/4" />
      <p className="mb-1 flex min-w-0 flex-col overflow-hidden text-neutral-content/50">
        此文章收录于专栏：
      </p>

      <FloatPopover
        placement="right"
        strategy="fixed"
        wrapperClassNames="flex flex-grow flex-shrink min-w-0"
        TriggerComponent={ToTopicLink}
      >
        <NoteTopicDetail topic={topic} />
      </FloatPopover>
    </>
  )
}
