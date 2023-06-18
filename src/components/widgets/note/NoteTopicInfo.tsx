'use client'

import { Divider } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { useNoteData } from '~/hooks/data/use-note'

import { NoteTopicDetail, ToTopicLink } from './NoteTopicDetail'

export const NoteTopicInfo = () => {
  const note = useNoteData()

  if (!note?.topic) return null

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
        <NoteTopicDetail topic={note.topic} />
      </FloatPopover>
    </>
  )
}
